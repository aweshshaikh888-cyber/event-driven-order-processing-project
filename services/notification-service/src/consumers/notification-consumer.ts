import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import {
  KafkaClient,
  KafkaTopics,
  EventType,
  IdempotentConsumer,
} from '@order-system/shared';

export class NotificationConsumer {
  constructor(private pool: Pool, private kafkaClient: KafkaClient) {}

  async start(): Promise<void> {
    await this.kafkaClient.createConsumer(
      'notification-service-group',
      [
        KafkaTopics.ORDER_EVENTS,
        KafkaTopics.INVENTORY_EVENTS,
        KafkaTopics.PAYMENT_EVENTS,
      ],
      async ({ topic, message }, span) => {
        if (!message.value) return;

        const event = JSON.parse(message.value.toString());
        const { id: eventId, type: eventType, aggregateId: orderId, data } = event;

        span.setAttribute('order.id', orderId);
        span.setAttribute('event.type', eventType);

        await IdempotentConsumer.executeIdempotent(
          this.pool,
          eventId,
          eventType,
          orderId,
          'NotificationServiceHandler',
          async (client) => {
            await this.dispatchNotification(client, eventId, eventType, orderId, data);
          }
        );
      }
    );
    console.log('[Notification Consumer] Subscribed to all domain event topics');
  }

  private async dispatchNotification(
    client: PoolClient,
    eventId: string,
    eventType: string,
    orderId: string,
    data: any
  ) {
    let subject = '';
    let messageBody = '';
    const recipient = data.customerId ? `${data.customerId}@example.com` : 'customer@example.com';

    switch (eventType) {
      case EventType.ORDER_CREATED:
        subject = `Order Placed: #${orderId}`;
        messageBody = `Thank you! Your order #${orderId} for $${data.totalAmount} has been placed and is currently being processed.`;
        break;

      case EventType.ORDER_CONFIRMED:
        subject = `Order Confirmed: #${orderId}`;
        messageBody = `Great news! Payment of $${data.totalAmount} succeeded. Order #${orderId} is confirmed and preparing for shipment.`;
        break;

      case EventType.ORDER_CANCELLED:
        subject = `Order Cancelled: #${orderId}`;
        messageBody = `Your order #${orderId} was cancelled. Reason: ${data.reason}. Any reserved items or payments have been compensated.`;
        break;

      case EventType.PAYMENT_FAILED:
        subject = `Payment Alert: Order #${orderId}`;
        messageBody = `Payment processing failed for order #${orderId}: ${data.reason}.`;
        break;

      case EventType.INVENTORY_FAILED:
        subject = `Out of Stock: Order #${orderId}`;
        messageBody = `We could not reserve the items for order #${orderId}: ${data.reason}.`;
        break;

      default:
        // Other events do not trigger direct user emails
        return;
    }

    const notificationId = `notif-${uuidv4().substring(0, 8)}`;
    await client.query(
      `INSERT INTO notifications (id, order_id, event_type, recipient, channel, subject, message_body)
       VALUES ($1, $2, $3, $4, 'EMAIL', $5, $6)`,
      [notificationId, orderId, eventType, recipient, subject, messageBody]
    );

    console.log(`📧 [Notification Dispatched] ${subject} -> Sent to ${recipient}`);
  }
}
