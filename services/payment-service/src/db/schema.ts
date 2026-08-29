import { Pool } from 'pg';
import { OutboxRepository, IdempotentConsumer } from '@order-system/shared';

export async function initPaymentDatabase(pool: Pool): Promise<void> {
  await OutboxRepository.initSchema(pool);
  await IdempotentConsumer.initSchema(pool);

  const sql = `
    CREATE TABLE IF NOT EXISTS payments (
      id VARCHAR(64) PRIMARY KEY,
      order_id VARCHAR(64) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
      payment_method VARCHAR(64) NOT NULL DEFAULT 'CREDIT_CARD',
      failure_reason TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chaos_settings (
      id INT PRIMARY KEY DEFAULT 1,
      delay_ms INT NOT NULL DEFAULT 0,
      fail_next_count INT NOT NULL DEFAULT 0
    );

    INSERT INTO chaos_settings (id, delay_ms, fail_next_count)
    VALUES (1, 0, 0)
    ON CONFLICT (id) DO NOTHING;

    CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
  `;
  await pool.query(sql);
  console.log('[Payment DB] Tables and chaos settings initialized');
}
