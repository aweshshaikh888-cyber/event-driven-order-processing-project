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
import { initOrderDatabase } from './db/schema';
import { createOrderRouter } from './routes/order-routes';
import { OrderSagaCoordinator } from './saga/order-saga-coordinator';

const SERVICE_NAME = 'order-service';
const PORT = process.env.ORDER_SERVICE_PORT || 3001;
const DB_URL = process.env.ORDER_DB_URL || 'postgres://postgres:postgres@localhost:5432/order_db';

// Initialize OpenTelemetry Tracing
initTelemetry(SERVICE_NAME);

async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Initialize DB Pool
  const pool = createDatabasePool(DB_URL);
  await initOrderDatabase(pool);

  // Initialize Kafka Client
  const kafkaClient = new KafkaClient(SERVICE_NAME);

  // Start Outbox Relay Worker
  const outboxRelay = new OutboxRelay(pool, kafkaClient, SERVICE_NAME);
  await outboxRelay.start();

  // Start Saga Coordinator Kafka Consumer
  const sagaCoordinator = new OrderSagaCoordinator(pool, kafkaClient);
  await sagaCoordinator.start();

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: SERVICE_NAME, timestamp: new Date().toISOString() });
  });

  // Mount API Routes
  app.use('/api/v1', createOrderRouter(pool));

  const server = app.listen(PORT, () => {
    console.log(`🚀 [${SERVICE_NAME}] Listening on http://localhost:${PORT}`);
  });

  // Graceful shutdown
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
