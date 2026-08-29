import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import {
  KafkaClient,
  KafkaTopics,
  EventType,
  IdempotentConsumer,
  OutboxRepository,
  OrderItem,
  InventoryReservedEvent,
  InventoryFailedEvent,
} from '@order-system/shared';

export class InventoryConsumer {
  constructor(private pool: Pool, private kafkaClient: KafkaClient) {}

  async start(): Promise<void> {
    await this.kafkaClient.createConsumer(
      'inventory-service-group',
      [KafkaTopics.ORDER_EVENTS, KafkaTopics.INVENTORY_EVENTS],
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
          'InventoryServiceHandler',
          async (client) => {
            switch (eventType) {
              case EventType.ORDER_CREATED:
                await this.handleOrderCreated(client, orderId, data);
                break;

              case EventType.INVENTORY_RELEASED:
                await this.handleInventoryReleased(client, orderId, data);
                break;

              default:
                // Ignore other order events
                break;
            }
          }
        );
      }
    );
    console.log('[Inventory Consumer] Subscribed to order.events and inventory.events');
  }

  private async handleOrderCreated(client: PoolClient, orderId: string, data: any) {
    const items: OrderItem[] = data.items;
    console.log(`[Inventory] Checking stock for order ${orderId}, items count: ${items.length}`);

    const itemIds = items.map((i) => i.itemId);

    // Fetch and lock items
    const checkSql = `
      SELECT item_id, name, available_quantity, reserved_quantity, price
      FROM inventory_items
      WHERE item_id = ANY($1)
      FOR UPDATE;
    `;
    const res = await client.query(checkSql, [itemIds]);
    const inventoryMap = new Map<string, any>(res.rows.map((row) => [row.item_id, row]));

    // Verify stock availability
    let isStockAvailable = true;
    let failureReason = '';

    for (const item of items) {
      const stock = inventoryMap.get(item.itemId);
      if (!stock) {
        isStockAvailable = false;
        failureReason = `Item '${item.itemId}' does not exist in inventory`;
        break;
      }
      if (stock.available_quantity < item.quantity) {
        isStockAvailable = false;
        failureReason = `Insufficient stock for '${stock.name}' (Requested: ${item.quantity}, Available: ${stock.available_quantity})`;
        break;
      }
    }

    if (isStockAvailable) {
      const reservationId = `res-${uuidv4().substring(0, 8)}`;

      // Deduct available, increment reserved
      for (const item of items) {
        await client.query(
          `UPDATE inventory_items 
           SET available_quantity = available_quantity - $1, 
               reserved_quantity = reserved_quantity + $1,
               updated_at = CURRENT_TIMESTAMP
           WHERE item_id = $2`,
          [item.quantity, item.itemId]
        );
      }

      // Record reservation
      await client.query(
        `INSERT INTO inventory_reservations (reservation_id, order_id, status, items)
         VALUES ($1, $2, 'RESERVED', $3)`,
        [reservationId, orderId, JSON.stringify(items)]
      );

      console.log(`[Inventory] Stock successfully reserved for order ${orderId} (ResID: ${reservationId})`);

      // Write InventoryReservedEvent to outbox
      const reservedEvent: InventoryReservedEvent = {
        id: `evt-inv-res-${uuidv4()}`,
        type: EventType.INVENTORY_RESERVED,
        aggregateId: orderId,
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          orderId,
          reservationId,
          items,
          totalAmount: data.totalAmount,
        },
      };

      await OutboxRepository.saveEvent(
        client,
        KafkaTopics.INVENTORY_EVENTS,
        reservedEvent,
        'INVENTORY'
      );
    } else {
      console.warn(`[Inventory] Stock reservation failed for order ${orderId}: ${failureReason}`);

      // Write InventoryFailedEvent to outbox
      const failedEvent: InventoryFailedEvent = {
        id: `evt-inv-fail-${uuidv4()}`,
        type: EventType.INVENTORY_FAILED,
        aggregateId: orderId,
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          orderId,
          reason: failureReason,
          items,
        },
      };

      await OutboxRepository.saveEvent(
        client,
        KafkaTopics.INVENTORY_EVENTS,
        failedEvent,
        'INVENTORY'
      );
    }
  }

  private async handleInventoryReleased(client: PoolClient, orderId: string, data: any) {
    console.log(`[Inventory Compensation] Releasing reserved stock for order ${orderId}. Reason: ${data.reason}`);

    // Fetch active reservations
    const resSql = `
      SELECT reservation_id, items, status 
      FROM inventory_reservations 
      WHERE order_id = $1 AND status = 'RESERVED'
      FOR UPDATE;
    `;
    const res = await client.query(resSql, [orderId]);

    if (res.rows.length === 0) {
      console.log(`[Inventory Compensation] No active reservation found to release for order ${orderId}`);
      return;
    }

    for (const reservation of res.rows) {
      const items: OrderItem[] = typeof reservation.items === 'string' ? JSON.parse(reservation.items) : reservation.items;

      for (const item of items) {
        await client.query(
          `UPDATE inventory_items 
           SET available_quantity = available_quantity + $1, 
               reserved_quantity = GREATEST(0, reserved_quantity - $1),
               updated_at = CURRENT_TIMESTAMP
           WHERE item_id = $2`,
          [item.quantity, item.itemId]
        );
      }

      await client.query(
        `UPDATE inventory_reservations 
         SET status = 'RELEASED' 
         WHERE reservation_id = $1`,
        [reservation.reservation_id]
      );

      console.log(`[Inventory Compensation] Released reservation ${reservation.reservation_id} for order ${orderId}`);
    }
  }
}
