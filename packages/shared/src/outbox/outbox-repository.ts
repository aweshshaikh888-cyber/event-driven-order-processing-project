import { PoolClient, Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { BaseEvent, KafkaTopics } from '../contracts/events';
import { injectTraceContext } from '../telemetry/tracer';

export interface OutboxRecord {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  topic: string;
  payload: any;
  headers: Record<string, string>;
  status: 'PENDING' | 'PUBLISHED' | 'FAILED';
  retryCount: number;
  lastError?: string;
  createdAt: Date;
  publishedAt?: Date;
}

export class OutboxRepository {
  static async initSchema(pool: Pool): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS outbox (
        id VARCHAR(64) PRIMARY KEY,
        aggregate_type VARCHAR(64) NOT NULL,
        aggregate_id VARCHAR(64) NOT NULL,
        event_type VARCHAR(64) NOT NULL,
        topic VARCHAR(128) NOT NULL,
        payload JSONB NOT NULL,
        headers JSONB NOT NULL DEFAULT '{}'::jsonb,
        status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
        retry_count INT NOT NULL DEFAULT 0,
        last_error TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP WITH TIME ZONE
      );
      CREATE INDEX IF NOT EXISTS idx_outbox_status_created ON outbox(status, created_at);
    `;
    await pool.query(sql);
  }

  /**
   * Appends an event to the outbox table inside an existing client/transaction
   */
  static async saveEvent(
    client: PoolClient,
    topic: KafkaTopics | string,
    event: BaseEvent,
    aggregateType: string
  ): Promise<string> {
    const id = event.id || uuidv4();
    const headers = injectTraceContext({
      'event-id': id,
      'event-type': event.type,
      'aggregate-id': event.aggregateId,
      'created-at': event.timestamp,
    });

    const sql = `
      INSERT INTO outbox (
        id, aggregate_type, aggregate_id, event_type, topic, payload, headers, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')
      RETURNING id;
    `;

    await client.query(sql, [
      id,
      aggregateType,
      event.aggregateId,
      event.type,
      topic,
      JSON.stringify(event),
      JSON.stringify(headers),
    ]);

    return id;
  }

  /**
   * Fetches pending events for publishing with row-locking (FOR UPDATE SKIP LOCKED)
   * to avoid race conditions when multiple relay instances run.
   */
  static async fetchPendingEvents(
    client: PoolClient,
    batchSize: number = 20
  ): Promise<OutboxRecord[]> {
    const sql = `
      SELECT 
        id, 
        aggregate_type as "aggregateType", 
        aggregate_id as "aggregateId", 
        event_type as "eventType", 
        topic, 
        payload, 
        headers, 
        status, 
        retry_count as "retryCount", 
        last_error as "lastError", 
        created_at as "createdAt", 
        published_at as "publishedAt"
      FROM outbox
      WHERE status = 'PENDING'
      ORDER BY created_at ASC
      LIMIT $1
      FOR UPDATE SKIP LOCKED;
    `;

    const res = await client.query(sql, [batchSize]);
    return res.rows;
  }

  static async markAsPublished(client: PoolClient, id: string): Promise<void> {
    const sql = `
      UPDATE outbox 
      SET status = 'PUBLISHED', published_at = CURRENT_TIMESTAMP 
      WHERE id = $1;
    `;
    await client.query(sql, [id]);
  }

  static async markAsFailed(client: PoolClient, id: string, error: string): Promise<void> {
    const sql = `
      UPDATE outbox 
      SET retry_count = retry_count + 1, last_error = $2, 
          status = CASE WHEN retry_count + 1 >= 5 THEN 'FAILED' ELSE 'PENDING' END
      WHERE id = $1;
    `;
    await client.query(sql, [id, error]);
  }
}
