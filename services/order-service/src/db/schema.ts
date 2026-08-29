import { Pool } from 'pg';
import { OutboxRepository, IdempotentConsumer } from '@order-system/shared';

export async function initOrderDatabase(pool: Pool): Promise<void> {
  // 1. Initialize outbox table & processed_events table
  await OutboxRepository.initSchema(pool);
  await IdempotentConsumer.initSchema(pool);

  // 2. Initialize orders table
  const sql = `
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) PRIMARY KEY,
      customer_id VARCHAR(64) NOT NULL,
      total_amount NUMERIC(10, 2) NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
      items JSONB NOT NULL,
      reservation_id VARCHAR(64),
      payment_id VARCHAR(64),
      cancellation_reason TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS saga_logs (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(64) NOT NULL,
      step VARCHAR(64) NOT NULL,
      status VARCHAR(32) NOT NULL,
      details JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_saga_logs_order_id ON saga_logs(order_id);
  `;
  await pool.query(sql);
  console.log('[Order DB] Tables and schema initialized');
}
