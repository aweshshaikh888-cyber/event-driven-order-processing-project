import { Pool } from 'pg';
import {
  KafkaClient,
  KafkaTopics,
  EventType,
  IdempotentConsumer,
  OutboxRepository,
  withTransaction,
} from '@order-system/shared';

export class OrderSagaCoordinator {
  constructor(private pool: Pool, private kafkaClient: KafkaClient) {}

  async start(): Promise<void> {
    await this.kafkaClient.createConsumer(
      'order-saga-coordinator-group',
      [KafkaTopics.INVENTORY_EVENTS, KafkaTopics.PAYMENT_EVENTS],
      async ({ topic, message }, span) => {
        if (!message.value) return;

        const event = JSON.parse(message.value.toString());
        const { id: eventId, type: eventType, aggregateId: orderId, data } = event;

        span.setAttribute('order.id', orderId);
        span.setAttribute('order.event_type', eventType);

        await IdempotentConsumer.executeIdempotent(
          this.pool,
          eventId,
          eventType,
          orderId,
          'OrderSagaCoordinator',
          async (client) => {
            switch (eventType) {
              case EventType.INVENTORY_RESERVED:
                await this.handleInventoryReserved(client, orderId, data);
                break;

              case EventType.INVENTORY_FAILED:
                await this.handleInventoryFailed(client, orderId, data);
                break;

              case EventType.PAYMENT_COMPLETED:
                await this.handlePaymentCompleted(client, orderId, data);
                break;

              case EventType.PAYMENT_FAILED:
                await this.handlePaymentFailed(client, orderId, data);
                break;

              default:
                console.log(`[Order Saga] Unhandled event type: ${eventType}`);
            }
          }
        );
      }
    );
    console.log('[Order Saga Coordinator] Subscribed to inventory and payment events');
  }

  private async handleInventoryReserved(client: any, orderId: string, data: any) {
    console.log(`[Order Saga] Inventory reserved for order ${orderId}, reservationId: ${data.reservationId}`);
    
    await client.query(
      `UPDATE orders SET reservation_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [data.reservationId, orderId]
    );

    await client.query(
      `INSERT INTO saga_logs (order_id, step, status, details) VALUES ($1, $2, $3, $4)`,
      [orderId, 'INVENTORY_RESERVED', 'SUCCESS', JSON.stringify(data)]
    );
  }

  private async handleInventoryFailed(client: any, orderId: string, data: any) {
    console.warn(`[Order Saga] Inventory failed for order ${orderId}: ${data.reason}`);

    await client.query(
      `UPDATE orders SET status = 'CANCELLED', cancellation_reason = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [data.reason, orderId]
    );

    await client.query(
      `INSERT INTO saga_logs (order_id, step, status, details) VALUES ($1, $2, $3, $4)`,
      [orderId, 'INVENTORY_RESERVED', 'FAILED', JSON.stringify(data)]
    );

    // Write OrderCancelledEvent to outbox
    await OutboxRepository.saveEvent(
      client,
      KafkaTopics.ORDER_EVENTS,
      {
        id: `cancelled-${orderId}-${Date.now()}`,
        type: EventType.ORDER_CANCELLED,
        aggregateId: orderId,
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          orderId,
          reason: data.reason,
          failedStep: 'INVENTORY_RESERVATION',
          compensated: false,
        },
      },
      'ORDER'
    );
  }

  private async handlePaymentCompleted(client: any, orderId: string, data: any) {
    console.log(`[Order Saga] Payment completed for order ${orderId}, paymentId: ${data.paymentId}`);

    await client.query(
      `UPDATE orders SET status = 'CONFIRMED', payment_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [data.paymentId, orderId]
    );

    await client.query(
      `INSERT INTO saga_logs (order_id, step, status, details) VALUES ($1, $2, $3, $4)`,
      [orderId, 'PAYMENT_COMPLETED', 'SUCCESS', JSON.stringify(data)]
    );

    // Write OrderConfirmedEvent to outbox
    await OutboxRepository.saveEvent(
      client,
      KafkaTopics.ORDER_EVENTS,
      {
        id: `confirmed-${orderId}-${Date.now()}`,
        type: EventType.ORDER_CONFIRMED,
        aggregateId: orderId,
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          orderId,
          paymentId: data.paymentId,
          reservationId: data.reservationId || 'N/A',
          totalAmount: data.amount,
        },
      },
      'ORDER'
    );
  }

  private async handlePaymentFailed(client: any, orderId: string, data: any) {
    console.warn(`[Order Saga] Payment failed for order ${orderId}: ${data.reason}. Initiating SAGA COMPENSATION.`);

    // 1. Fetch reservation_id from order
    const orderRes = await client.query(`SELECT reservation_id, items FROM orders WHERE id = $1`, [orderId]);
    const order = orderRes.rows[0];

    // 2. Mark order as cancelled
    await client.query(
      `UPDATE orders SET status = 'CANCELLED', cancellation_reason = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [data.reason, orderId]
    );

    await client.query(
      `INSERT INTO saga_logs (order_id, step, status, details) VALUES ($1, $2, $3, $4)`,
      [orderId, 'PAYMENT_FAILED', 'FAILED', JSON.stringify(data)]
    );

    // 3. Compensating Transaction: Release Inventory
    if (order && order.reservation_id) {
      console.log(`[Order Saga] Triggering compensating transaction: Release inventory reservation ${order.reservation_id}`);
      await OutboxRepository.saveEvent(
        client,
        KafkaTopics.INVENTORY_EVENTS,
        {
          id: `compensate-inv-${orderId}-${Date.now()}`,
          type: EventType.INVENTORY_RELEASED,
          aggregateId: orderId,
          timestamp: new Date().toISOString(),
          version: 1,
          data: {
            orderId,
            reservationId: order.reservation_id,
            items: order.items,
            reason: `Compensating transaction due to payment failure: ${data.reason}`,
          },
        },
        'ORDER_SAGA'
      );
    }

    // 4. Notify Order Cancelled
    await OutboxRepository.saveEvent(
      client,
      KafkaTopics.ORDER_EVENTS,
      {
        id: `cancelled-${orderId}-${Date.now()}`,
        type: EventType.ORDER_CANCELLED,
        aggregateId: orderId,
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          orderId,
          reason: data.reason,
          failedStep: 'PAYMENT_PROCESSING',
          compensated: true,
        },
      },
      'ORDER'
    );
  }
}
