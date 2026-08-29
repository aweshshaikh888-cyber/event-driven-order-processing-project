import { Kafka, Consumer, logLevel } from 'kafkajs';
import { KafkaTopics, KafkaClient } from '@order-system/shared';
import dotenv from 'dotenv';
dotenv.config();

export interface DlqMessage {
  offset: string;
  partition: number;
  key: string;
  originalTopic: string;
  payload: any;
  errorReason: string;
  failedAt: string;
}

export class DlqService {
  private kafka: Kafka;
  private kafkaClient: KafkaClient;

  constructor() {
    const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
    this.kafka = new Kafka({
      clientId: 'dlq-manager',
      brokers,
      logLevel: logLevel.NOTHING,
    });
    this.kafkaClient = new KafkaClient('dlq-replay-producer', brokers);
  }

  async inspectMessages(maxMessages: number = 50): Promise<DlqMessage[]> {
    const consumer = this.kafka.consumer({ groupId: `dlq-inspector-${Date.now()}` });
    await consumer.connect();
    await consumer.subscribe({ topic: KafkaTopics.DEAD_LETTER_QUEUE, fromBeginning: true });

    const messages: DlqMessage[] = [];

    await new Promise<void>((resolve) => {
      let timeout: NodeJS.Timeout;

      consumer.run({
        eachMessage: async ({ partition, message }) => {
          clearTimeout(timeout);
          if (message.value) {
            try {
              const parsed = JSON.parse(message.value.toString());
              messages.push({
                offset: message.offset,
                partition,
                key: message.key?.toString() || 'unknown',
                originalTopic: parsed.originalTopic || 'unknown',
                payload: parsed.payload,
                errorReason: parsed.errorReason || 'unknown',
                failedAt: parsed.failedAt || new Date().toISOString(),
              });
            } catch {
              messages.push({
                offset: message.offset,
                partition,
                key: message.key?.toString() || 'unknown',
                originalTopic: 'unknown',
                payload: message.value.toString(),
                errorReason: 'Malformed JSON payload',
                failedAt: new Date().toISOString(),
              });
            }
          }

          if (messages.length >= maxMessages) {
            resolve();
          } else {
            timeout = setTimeout(() => resolve(), 2000);
          }
        },
      });

      timeout = setTimeout(() => resolve(), 3000);
    });

    await consumer.disconnect();
    return messages;
  }

  async replayMessages(targetKey?: string): Promise<{ replayedCount: number }> {
    const messages = await this.inspectMessages(100);
    let count = 0;

    for (const msg of messages) {
      if (!targetKey || msg.key === targetKey) {
        if (msg.originalTopic && msg.originalTopic !== 'unknown') {
          console.log(`[DLQ Replay] Republishing message ${msg.key} to original topic: ${msg.originalTopic}`);
          await this.kafkaClient.publish(msg.originalTopic, msg.key, msg.payload, {
            'replayed-from-dlq': 'true',
            'replayed-at': new Date().toISOString(),
          });
          count++;
        }
      }
    }

    await this.kafkaClient.disconnect();
    return { replayedCount: count };
  }
}
