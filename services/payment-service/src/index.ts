import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import {
  initTelemetry,
  createDatabasePool,
  KafkaClient,
  OutboxRelay,
} from '@order-system/shared';
import { initPaymentDatabase } from './db/schema';
import { createPaymentRouter } from './routes/payment-routes';
import { PaymentConsumer } from './consumers/payment-consumer';

const SERVICE_NAME = 'payment-service';
const PORT = process.env.PAYMENT_SERVICE_PORT || 3002;
const DB_URL = process.env.PAYMENT_DB_URL || 'postgres://postgres:postgres@localhost:5432/payment_db';

initTelemetry(SERVICE_NAME);

async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const pool = createDatabasePool(DB_URL);
  await initPaymentDatabase(pool);

  const kafkaClient = new KafkaClient(SERVICE_NAME);

  const outboxRelay = new OutboxRelay(pool, kafkaClient, SERVICE_NAME);
  await outboxRelay.start();

  const paymentConsumer = new PaymentConsumer(pool, kafkaClient);
  await paymentConsumer.start();

  app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: SERVICE_NAME, timestamp: new Date().toISOString() });
  });

  app.use('/api/v1', createPaymentRouter(pool));

  const server = app.listen(PORT, () => {
    console.log(`🚀 [${SERVICE_NAME}] Listening on http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    console.log(`[${SERVICE_NAME}] Shutting down gracefully...`);
    outboxRelay.stop();
    await kafkaClient.disconnect();
    await pool.end();
    server.close(() => {
      console.log(`[${SERVICE_NAME}] Stopped.`);
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((err) => {
  console.error(`[${SERVICE_NAME}] Fatal bootstrap error:`, err);
  process.exit(1);
});
