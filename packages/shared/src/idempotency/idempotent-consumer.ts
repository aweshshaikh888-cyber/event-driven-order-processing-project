import { Pool, PoolClient } from 'pg';
import { withTransaction } from '../database/db-pool';

export interface ProcessedEventRecord {
  eventId: string;
  eventType: string;
  aggregateId: string;
  handlerName: string;
  processedAt: Date;
}

export class IdempotentConsumer {
  static async initSchema(pool: Pool): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS processed_events (
        event_id VARCHAR(64) NOT NULL,
        event_type VARCHAR(64) NOT NULL,
        aggregate_id VARCHAR(64) NOT NULL,
        handler_name VARCHAR(128) NOT NULL,
        processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (event_id, handler_name)
      );
      CREATE INDEX IF NOT EXISTS idx_processed_events_agg ON processed_events(aggregate_id);
    `;
    await pool.query(sql);
  }

  /**
   * Executes business logic inside an atomic transaction guarded by the processed_events table.
   * If the event was already processed by this handler, it safely skips execution (Idempotent).
   */
  static async executeIdempotent<T>(
    pool: Pool,
    eventId: string,
    eventType: string,
    aggregateId: string,
    handlerName: string,
    handler: (client: PoolClient) => Promise<T>
  ): Promise<{ alreadyProcessed: boolean; result?: T }> {
    return withTransaction(pool, async (client) => {
      // Check if already processed
      const checkSql = `
        SELECT event_id 
        FROM processed_events 
        WHERE event_id = $1 AND handler_name = $2
        FOR UPDATE;
      `;
      const existing = await client.query(checkSql, [eventId, handlerName]);

      if (existing.rows.length > 0) {
        console.log(`[Idempotency] Event ${eventId} already processed by ${handlerName}. Skipping duplicate.`);
        return { alreadyProcessed: true };
      }

      // Record event processing
      const insertSql = `
        INSERT INTO processed_events (event_id, event_type, aggregate_id, handler_name)
        VALUES ($1, $2, $3, $4);
      `;
      await client.query(insertSql, [eventId, eventType, aggregateId, handlerName]);

      // Execute side-effecting domain logic in the same transaction
      const result = await handler(client);
      return { alreadyProcessed: false, result };
    });
  }
}
