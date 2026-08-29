import { Pool } from 'pg';
import { IdempotentConsumer } from '@order-system/shared';

export async function initNotificationDatabase(pool: Pool): Promise<void> {
  await IdempotentConsumer.initSchema(pool);

  const sql = `
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(64) PRIMARY KEY,
      order_id VARCHAR(64) NOT NULL,
      event_type VARCHAR(64) NOT NULL,
      recipient VARCHAR(128) NOT NULL,
      channel VARCHAR(32) NOT NULL DEFAULT 'EMAIL',
      subject VARCHAR(256) NOT NULL,
      message_body TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_notifications_order ON notifications(order_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);
  `;
  await pool.query(sql);
  console.log('[Notification DB] Tables initialized');
}
