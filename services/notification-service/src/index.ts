import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import {
  initTelemetry,
  createDatabasePool,
  KafkaClient,
} from '@order-system/shared';
import { initNotificationDatabase } from './db/schema';
import { createNotificationRouter } from './routes/notification-routes';
import { NotificationConsumer } from './consumers/notification-consumer';

const SERVICE_NAME = 'notification-service';
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3004;
const DB_URL = process.env.NOTIFICATION_DB_URL || 'postgres://postgres:postgres@localhost:5432/notification_db';

initTelemetry(SERVICE_NAME);

async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const pool = createDatabasePool(DB_URL);
  await initNotificationDatabase(pool);

  const kafkaClient = new KafkaClient(SERVICE_NAME);

  const notificationConsumer = new NotificationConsumer(pool, kafkaClient);
  await notificationConsumer.start();

  app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: SERVICE_NAME, timestamp: new Date().toISOString() });
  });

  app.use('/api/v1', createNotificationRouter(pool));

  const server = app.listen(PORT, () => {
    console.log(`🚀 [${SERVICE_NAME}] Listening on http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    console.log(`[${SERVICE_NAME}] Shutting down gracefully...`);
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
