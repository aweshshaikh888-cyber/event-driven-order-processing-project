import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import http from 'http';

dotenv.config();

const PORT = process.env.MONOLITH_SERVICE_PORT || 3000;
const DB_URL = process.env.MONOLITH_DB_URL || 'postgres://postgres:postgres@localhost:5432/monolith_db';

const pool = new Pool({ connectionString: DB_URL });

async function initMonolithDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory_items (
      item_id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(128) NOT NULL,
      available_quantity INT NOT NULL,
      price NUMERIC(10, 2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) PRIMARY KEY,
      customer_id VARCHAR(64) NOT NULL,
      total_amount NUMERIC(10, 2) NOT NULL,
      status VARCHAR(32) NOT NULL,
      items JSONB NOT NULL,
      payment_id VARCHAR(64),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id VARCHAR(64) PRIMARY KEY,
      order_id VARCHAR(64) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      status VARCHAR(32) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(64) PRIMARY KEY,
      order_id VARCHAR(64) NOT NULL,
      recipient VARCHAR(128) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO inventory_items (item_id, name, available_quantity, price)
    VALUES 
      ('item-1', 'MacBook Pro M3 Max', 50, 2499.00),
      ('item-2', 'Sony WH-1000XM5 Headphones', 20, 399.00),
      ('item-scarce', 'Limited Edition Keychron Q1 Pro', 2, 199.00),
      ('item-out-of-stock', 'NVIDIA RTX 5090 (Sold Out)', 0, 1999.00)
    ON CONFLICT (item_id) DO NOTHING;
  `);
  console.log('[Monolith DB] Initialized single database schema');
}

const app = express();
app.use(cors());
app.use(express.json());

// 1. Classical Monolith ACID Order Processing
app.post('/api/v1/monolith/orders', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  const client = await pool.connect();

  try {
    const { customerId, items, totalAmount } = req.body;
    const orderId = `mono-ord-${uuidv4().substring(0, 8)}`;
    const paymentId = `mono-pay-${uuidv4().substring(0, 8)}`;
    const notifId = `mono-notif-${uuidv4().substring(0, 8)}`;

    await client.query('BEGIN');

    // 1. Deduct Inventory
    for (const item of items) {
      const invRes = await client.query(
        `SELECT available_quantity FROM inventory_items WHERE item_id = $1 FOR UPDATE`,
        [item.itemId]
      );
      if (invRes.rows.length === 0 || invRes.rows[0].available_quantity < item.quantity) {
        throw new Error(`Out of stock for item ${item.itemId}`);
      }
      await client.query(
        `UPDATE inventory_items SET available_quantity = available_quantity - $1 WHERE item_id = $2`,
        [item.quantity, item.itemId]
      );
    }

    // 2. Process Payment
    await client.query(
      `INSERT INTO payments (id, order_id, amount, status) VALUES ($1, $2, $3, 'COMPLETED')`,
      [paymentId, orderId, totalAmount]
    );

    // 3. Create Order
    await client.query(
      `INSERT INTO orders (id, customer_id, total_amount, status, items, payment_id)
       VALUES ($1, $2, $3, 'CONFIRMED', $4, $5)`,
      [orderId, customerId, totalAmount, JSON.stringify(items), paymentId]
    );

    // 4. Save Notification
    await client.query(
      `INSERT INTO notifications (id, order_id, recipient, message)
       VALUES ($1, $2, $3, $4)`,
      [notifId, orderId, `${customerId}@example.com`, `Order ${orderId} confirmed via single ACID transaction`]
    );

    await client.query('COMMIT');

    const durationMs = Date.now() - startTime;
    res.json({
      architecture: 'Monolith (Single ACID DB Transaction)',
      orderId,
      status: 'CONFIRMED',
      durationMs,
      message: 'Order completed synchronously within single database transaction.',
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});

// 2. Synchronous Degradation Demo: Monolith synchronously calling external Payment microservice
app.post('/api/v1/monolith/orders/sync-with-slow-payment', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const { paymentDelayMs = 3000 } = req.body;
    console.log(`[Sync Demo] Simulating synchronous call to Payment Service with ${paymentDelayMs}ms delay...`);

    // Synchronous HTTP wait
    await new Promise((resolve) => setTimeout(resolve, paymentDelayMs));

    const durationMs = Date.now() - startTime;
    res.json({
      architecture: 'Synchronous Distributed (Tightly Coupled)',
      durationMs,
      warning: 'Downstream payment slowness directly degraded Order response time and held connection thread pool!',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'UP', service: 'monolith' }));

async function bootstrap() {
  await initMonolithDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 [Monolith Service] Listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => console.error('[Monolith] Fatal error:', err));
