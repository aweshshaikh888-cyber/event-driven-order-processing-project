import { Pool } from 'pg';
import { KafkaClient } from '../messaging/kafka-client';
import { OutboxRepository, OutboxRecord } from './outbox-repository';
import { withSpan } from '../telemetry/tracer';

export class OutboxRelay {
  private isRunning: boolean = false;
  private timer: NodeJS.Timeout | null = null;
  private pollIntervalMs: number;

  constructor(
    private pool: Pool,
    private kafkaClient: KafkaClient,
    private serviceName: string,
    pollIntervalMs?: number
  ) {
    this.pollIntervalMs =
      pollIntervalMs ||
      parseInt(process.env.OUTBOX_POLL_INTERVAL_MS || '500', 10);
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[Outbox Relay - ${this.serviceName}] Started polling loop (${this.pollIntervalMs}ms)`);
    this.poll();
  }

  private async poll(): Promise<void> {
    if (!this.isRunning) return;

    try {
      await this.processBatch();
    } catch (err: any) {
      console.error(`[Outbox Relay - ${this.serviceName}] Poll error:`, err.message);
    } finally {
      if (this.isRunning) {
        this.timer = setTimeout(() => this.poll(), this.pollIntervalMs);
      }
    }
  }

  async processBatch(batchSize: number = 25): Promise<number> {
    const client = await this.pool.connect();
    let publishedCount = 0;

    try {
      await client.query('BEGIN');
      const pendingRecords: OutboxRecord[] = await OutboxRepository.fetchPendingEvents(client, batchSize);

      if (pendingRecords.length > 0) {
        for (const record of pendingRecords) {
          await withSpan(`OutboxRelay.Publish ${record.topic}`, async (span) => {
            span.setAttribute('outbox.event_id', record.id);
            span.setAttribute('outbox.event_type', record.eventType);
            span.setAttribute('outbox.aggregate_id', record.aggregateId);

            try {
              const payload = typeof record.payload === 'string' ? JSON.parse(record.payload) : record.payload;
              const headers = typeof record.headers === 'string' ? JSON.parse(record.headers) : record.headers;

              await this.kafkaClient.publish(
                record.topic,
                record.aggregateId,
                payload,
                headers
              );

              await OutboxRepository.markAsPublished(client, record.id);
              publishedCount++;
            } catch (publishErr: any) {
              console.error(
                `[Outbox Relay - ${this.serviceName}] Error publishing record ${record.id}:`,
                publishErr.message
              );
              await OutboxRepository.markAsFailed(client, record.id, publishErr.message);
            }
          });
        }
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return publishedCount;
  }

  stop(): void {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    console.log(`[Outbox Relay - ${this.serviceName}] Stopped`);
  }
}
