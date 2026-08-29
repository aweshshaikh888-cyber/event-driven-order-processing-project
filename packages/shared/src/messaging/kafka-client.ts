import { Kafka, Producer, Consumer, EachMessagePayload, logLevel } from 'kafkajs';
import { KafkaTopics } from '../contracts/events';
import { extractTraceContext, withSpan, injectTraceContext } from '../telemetry/tracer';

export class KafkaClient {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private consumers: Consumer[] = [];

  constructor(clientId: string, brokers?: string[]) {
    const brokerList = brokers || (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
    this.kafka = new Kafka({
      clientId,
      brokers: brokerList,
      logLevel: logLevel.ERROR,
      retry: {
        initialRetryTime: 300,
        retries: 5,
      },
    });
  }

  async getProducer(): Promise<Producer> {
    if (!this.producer) {
      this.producer = this.kafka.producer({
        allowAutoTopicCreation: true,
      });
      await this.producer.connect();
      console.log(`[Kafka] Producer connected successfully`);
    }
    return this.producer;
  }

  async publish(
    topic: KafkaTopics | string,
    key: string,
    payload: any,
    headers: Record<string, string> = {}
  ): Promise<void> {
    const producer = await this.getProducer();
    const traceHeaders = injectTraceContext(headers);

    const kafkaHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(traceHeaders)) {
      if (v !== undefined) kafkaHeaders[k] = String(v);
    }

    await producer.send({
      topic,
      messages: [
        {
          key,
          value: typeof payload === 'string' ? payload : JSON.stringify(payload),
          headers: kafkaHeaders,
        },
      ],
    });
  }

  async sendToDlq(
    originalTopic: string,
    key: string,
    payload: any,
    errorReason: string,
    headers: Record<string, any> = {}
  ): Promise<void> {
    const dlqPayload = {
      originalTopic,
      key,
      payload,
      errorReason,
      failedAt: new Date().toISOString(),
    };

    console.warn(`[DLQ] Sending message to ${KafkaTopics.DEAD_LETTER_QUEUE}: ${key} - ${errorReason}`);
    await this.publish(KafkaTopics.DEAD_LETTER_QUEUE, key, dlqPayload, {
      ...headers,
      'is-dlq': 'true',
      'error-reason': errorReason,
    });
  }

  async createConsumer(
    groupId: string,
    topics: (KafkaTopics | string)[],
    messageHandler: (payload: EachMessagePayload, contextSpan: any) => Promise<void>,
    options: { maxRetries?: number } = {}
  ): Promise<Consumer> {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();

    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: false });
    }

    const maxRetries = options.maxRetries ?? 3;

    await consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        const key = message.key?.toString() || 'unknown';
        const rawHeaders: Record<string, string> = {};

        if (message.headers) {
          for (const [k, v] of Object.entries(message.headers)) {
            if (v) rawHeaders[k] = v.toString();
          }
        }

        const parentContext = extractTraceContext(rawHeaders);

        await withSpan(
          `Kafka.Consume ${topic}`,
          async (span) => {
            span.setAttribute('messaging.system', 'kafka');
            span.setAttribute('messaging.destination', topic);
            span.setAttribute('messaging.kafka.partition', partition);
            span.setAttribute('messaging.kafka.message_key', key);

            let attempt = 0;
            let success = false;
            let lastError: any = null;

            while (attempt < maxRetries && !success) {
              attempt++;
              try {
                await messageHandler(payload, span);
                success = true;
              } catch (err: any) {
                lastError = err;
                console.error(
                  `[Consumer ${groupId}] Error processing ${topic} [attempt ${attempt}/${maxRetries}]:`,
                  err.message
                );
                if (attempt < maxRetries) {
                  await new Promise((res) => setTimeout(res, 500 * attempt));
                }
              }
            }

            if (!success) {
              span.recordException(lastError);
              const messageValue = message.value ? message.value.toString() : null;
              await this.sendToDlq(
                topic,
                key,
                messageValue,
                lastError?.message || 'Exceeded max retries',
                rawHeaders
              );
            }
          },
          parentContext
        );
      },
    });

    this.consumers.push(consumer);
    return consumer;
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
    }
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
