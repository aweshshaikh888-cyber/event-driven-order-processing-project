import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import {
  withTransaction,
  OutboxRepository,
  KafkaTopics,
  EventType,
  OrderCreatedEvent,
} from '@order-system/shared';

export function createOrderRouter(pool: Pool): Router {
  const router = Router();

  // POST /api/v1/orders - Create Order (Transactional Outbox Pattern)
  router.post('/orders', async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId, items, totalAmount } = req.body;

      if (!customerId || !items || !Array.isArray(items) || items.length === 0 || totalAmount === undefined) {
        res.status(400).json({ error: 'Invalid order payload. customerId, items array, and totalAmount are required.' });
        return;
      }

      const orderId = `ord-${uuidv4().substring(0, 8)}`;
      const eventId = `evt-${uuidv4()}`;

      const orderCreatedEvent: OrderCreatedEvent = {
        id: eventId,
        type: EventType.ORDER_CREATED,
        aggregateId: orderId,
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          orderId,
          customerId,
          items,
          totalAmount: Number(totalAmount),
        },
      };

      // ACID Transaction: Write to orders table AND outbox table atomically
      await withTransaction(pool, async (client) => {
        // 1. Insert order with status PENDING
        const insertOrderSql = `
          INSERT INTO orders (id, customer_id, total_amount, status, items)
          VALUES ($1, $2, $3, 'PENDING', $4);
        `;
        await client.query(insertOrderSql, [
          orderId,
          customerId,
          totalAmount,
          JSON.stringify(items),
        ]);

        // 2. Insert initial saga log
        await client.query(
          `INSERT INTO saga_logs (order_id, step, status, details) VALUES ($1, $2, $3, $4)`,
          [orderId, 'ORDER_CREATED', 'PENDING', JSON.stringify({ customerId, totalAmount, itemsCount: items.length })]
        );

        // 3. Insert Outbox Event
        await OutboxRepository.saveEvent(
          client,
          KafkaTopics.ORDER_EVENTS,
          orderCreatedEvent,
          'ORDER'
        );
      });

      res.status(202).json({
        success: true,
        orderId,
        status: 'PENDING',
        message: 'Order created and event persisted to Outbox table atomically.',
        checkStatusUrl: `/api/v1/orders/${orderId}`,
      });
    } catch (error: any) {
      console.error('[Order Router] Error creating order:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // GET /api/v1/orders/:id - Retrieve order status & saga history
  router.get('/orders/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const orderRes = await pool.query(`SELECT * FROM orders WHERE id = $1`, [id]);
      if (orderRes.rows.length === 0) {
        res.status(404).json({ error: `Order ${id} not found` });
        return;
      }

      const sagaRes = await pool.query(
        `SELECT id, step, status, details, created_at FROM saga_logs WHERE order_id = $1 ORDER BY created_at ASC`,
        [id]
      );

      const outboxRes = await pool.query(
        `SELECT id, event_type, status, created_at, published_at FROM outbox WHERE aggregate_id = $1 ORDER BY created_at ASC`,
        [id]
      );

      res.json({
        order: orderRes.rows[0],
        sagaHistory: sagaRes.rows,
        outboxEvents: outboxRes.rows,
      });
    } catch (error: any) {
      console.error('[Order Router] Error fetching order:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/orders - List all orders
  router.get('/orders', async (req: Request, res: Response): Promise<void> => {
    try {
      const ordersRes = await pool.query(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 50`);
      res.json({ orders: ordersRes.rows });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
