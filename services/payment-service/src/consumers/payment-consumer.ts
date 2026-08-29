import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import {
  KafkaClient,
  KafkaTopics,
  EventType,
  IdempotentConsumer,
  OutboxRepository,
  PaymentCompletedEvent,
  PaymentFailedEvent,
} from '@order-system/shared';

export class PaymentConsumer {
  constructor(private pool: Pool, private kafkaClient: KafkaClient) {}

  async start(): Promise<void> {
    await this.kafkaClient.createConsumer(
      'payment-service-group',
      [KafkaTopics.INVENTORY_EVENTS, KafkaTopics.PAYMENT_EVENTS],
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
          'PaymentServiceHandler',
          async (client) => {
            switch (eventType) {
              case EventType.INVENTORY_RESERVED:
                await this.handleInventoryReserved(client, orderId, data);
                break;

              default:
                break;
            }
          }
        );
      }
    );
    console.log('[Payment Consumer] Subscribed to inventory.events');
  }

  private async handleInventoryReserved(client: PoolClient, orderId: string, data: any) {
    const amount = Number(data.totalAmount || 0);
    console.log(`[Payment] Processing payment for order ${orderId} (Amount: $${amount})`);

    // Check chaos settings
    const chaosRes = await client.query(`SELECT delay_ms, fail_next_count FROM chaos_settings WHERE id = 1 FOR UPDATE`);
    const chaos = chaosRes.rows[0] || { delay_ms: 0, fail_next_count: 0 };

    if (chaos.delay_ms > 0) {
      console.log(`[Payment Chaos] Simulating latency delay of ${chaos.delay_ms}ms...`);
      await new Promise((resolve) => setTimeout(resolve, chaos.delay_ms));
    }

    let shouldFail = false;
    let failureReason = '';

    if (chaos.fail_next_count > 0) {
      shouldFail = true;
      failureReason = 'SIMULATED_FAILURE: Card declined (insufficient funds / fraud check)';
      await client.query(`UPDATE chaos_settings SET fail_next_count = GREATEST(0, fail_next_count - 1) WHERE id = 1`);
      console.warn(`[Payment Chaos] Decremented fail_next_count. Triggering simulated failure for order ${orderId}`);
    } else if (amount > 10000) {
      shouldFail = true;
      failureReason = `Transaction amount $${amount} exceeds credit limit ($10,000.00)`;
    }

    const paymentId = `pay-${uuidv4().substring(0, 8)}`;

    if (!shouldFail) {
      // Record successful payment
      await client.query(
        `INSERT INTO payments (id, order_id, amount, status, payment_method)
         VALUES ($1, $2, $3, 'COMPLETED', 'CREDIT_CARD')`,
        [paymentId, orderId, amount]
      );

      console.log(`[Payment] Payment successful for order ${orderId} (PaymentID: ${paymentId})`);

      // Write PaymentCompletedEvent to outbox
      const completedEvent: PaymentCompletedEvent = {
        id: `evt-pay-comp-${uuidv4()}`,
        type: EventType.PAYMENT_COMPLETED,
        aggregateId: orderId,
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          orderId,
          paymentId,
          amount,
          paymentMethod: 'CREDIT_CARD',
        },
      };

      await OutboxRepository.saveEvent(
        client,
        KafkaTopics.PAYMENT_EVENTS,
        completedEvent,
        'PAYMENT'
      );
    } else {
      // Record failed payment
      await client.query(
        `INSERT INTO payments (id, order_id, amount, status, payment_method, failure_reason)
         VALUES ($1, $2, $3, 'FAILED', 'CREDIT_CARD', $4)`,
        [paymentId, orderId, amount, failureReason]
      );

      console.warn(`[Payment] Payment failed for order ${orderId}: ${failureReason}`);

      // Write PaymentFailedEvent to outbox
      const failedEvent: PaymentFailedEvent = {
        id: `evt-pay-fail-${uuidv4()}`,
        type: EventType.PAYMENT_FAILED,
        aggregateId: orderId,
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          orderId,
          reason: failureReason,
          amount,
          items: data.items,
        },
      };

      await OutboxRepository.saveEvent(
        client,
        KafkaTopics.PAYMENT_EVENTS,
        failedEvent,
        'PAYMENT'
      );
    }
  }
}
