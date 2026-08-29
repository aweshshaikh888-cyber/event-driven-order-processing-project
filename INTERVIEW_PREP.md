# 🎯 Distributed Systems Interview Master Guide

This guide breaks down the core distributed systems architectural interview questions and solutions implemented in this project.

---

## ❓ Question 1: The Dual-Write Problem & Transactional Outbox Pattern

> **Interview Question**: *"Your service writes to Postgres and publishes to Kafka. The process crashes between the two. What happens, and how does the outbox pattern fix it?"*

### The Problem (The Dual-Write Anti-Pattern)
In a naive implementation:
```typescript
// Anti-Pattern: Non-atomic dual write
await db.orders.insert(orderData); // Step 1: Database write
await kafkaProducer.send('order.events', orderData); // Step 2: Message publish
```
If the process crashes (OOM, server restart, network partition) right after Step 1 commits to Postgres:
- The database contains the order in `PENDING` state.
- Kafka never receives the `order.created` event.
- Downstream services (Inventory, Payment, Notification) never process the order.
- The order is permanently orphaned in an inconsistent state.

Conversely, if you publish to Kafka first and the database insert fails:
- Downstream services reserve inventory and charge the card.
- The user's order does not exist in the primary database.

### The Solution: Transactional Outbox Pattern
Instead of communicating with two disparate distributed systems (PostgreSQL and Kafka) in the same request handler:

1. **Atomic Single-System Write**: We create an `outbox` table in the **same PostgreSQL database** as the `orders` table.
2. In a single SQL ACID transaction (`BEGIN ... COMMIT`):
   ```sql
   INSERT INTO orders (id, customer_id, total_amount, status) VALUES (...);
   INSERT INTO outbox (id, aggregate_type, aggregate_id, event_type, topic, payload, headers, status) VALUES (...);
   ```
   Both rows either commit together or roll back together.
3. **Outbox Relay Worker**: A separate background worker periodically queries the `outbox` table with `SELECT ... WHERE status = 'PENDING' FOR UPDATE SKIP LOCKED`, publishes the event to Kafka, and updates the status to `PUBLISHED`.
4. **At-Least-Once Delivery & Idempotency**: If the relay worker crashes after publishing to Kafka but before updating the `outbox` row to `PUBLISHED`, the event may be republished upon restart. This gives **at-least-once delivery**, which is safely handled downstream by our **Idempotent Consumers**.

---

## ❓ Question 2: Saga Compensating Flow

> **Interview Question**: *"Payment succeeded but Inventory has no stock. Describe the compensating flow in order."*

### Step-by-Step Flow:
In our choreography/orchestration hybrid architecture:

1. **Order Initiation**: Client sends `POST /api/v1/orders`. Order Service creates order `ord-123` in `PENDING` status and writes `order.created` to outbox.
2. **Inventory Stock Check**: Inventory Service consumes `order.created`. It inspects stock with `SELECT ... FOR UPDATE` on inventory rows and discovers item quantity is 0 (out of stock).
3. **Inventory Failure Event**: Inventory Service writes `inventory.failed` event to its outbox with reason `"Insufficient stock for item X"`.
4. **Payment Abort**: Because Payment Service listens only for `inventory.reserved`, payment processing is automatically bypassed for this order. No charge is made.
5. **Order Cancellation**: Order Saga Coordinator consumes `inventory.failed`. It:
   - Updates order `ord-123` status to `CANCELLED` with `cancellation_reason = "Out of Stock"`.
   - Records failure in `saga_logs` table.
   - Publishes `order.cancelled` event to outbox.
6. **Notification**: Notification Service consumes `order.cancelled` and sends an email to the customer: *"Your order was cancelled due to stock unavailability."*

### Alternative Flow: Payment Succeeded First (or Partial Downstream Failure)
If Payment had succeeded before a downstream fulfillment failure occurred:
1. Order Saga coordinator detects the downstream failure.
2. Order Saga publishes a **Compensating Event**: `payment.refund` (or `payment.compensate`).
3. Payment Service consumes the compensating event, executes a payment gateway refund, updates payment status to `REFUNDED`, and publishes `payment.refunded`.
4. Inventory Service consumes `inventory.released` and restores reserved stock.
5. Order Service marks order as `CANCELLED (Compensated)`.

---

## ❓ Question 3: Monolith vs Microservices - Honest Trade-Offs

> **Interview Question**: *"What did you lose by moving from the monolith to microservices? Be honest."*

### What We Gained:
- **Independent Scalability**: Payment Service can scale up independently during checkout spikes (e.g. Black Friday) without scaling the entire monolith.
- **Fault Isolation**: If the Payment gateway or Notification service experiences high latency or outages, Order creation still succeeds asynchronously without taking down the API.
- **Independent Deployability**: Teams can deploy Inventory updates without risking regressions in Payment.

### What We Lost (The Honest Trade-Offs):
1. **Loss of Immediate ACID Consistency**:
   - Monolith: A single `BEGIN ... COMMIT` across `orders`, `inventory`, `payments` provides instant, guaranteed ACID consistency.
   - Microservices: We must embrace **Eventual Consistency**. The client receives `202 Accepted` and must poll or use WebSockets/SSE to know the final outcome.
2. **Significant Operational Complexity**:
   - Monolith: 1 application binary, 1 database connection pool, 1 log stream.
   - Microservices: 4 independent services, 4 databases, Apache Kafka cluster, Schema registry, Outbox relays, OpenTelemetry Collector, and Jaeger.
3. **Network Latency & Distributed Debugging**:
   - Monolith: Function calls in memory take nanoseconds.
   - Microservices: Network serialization, Kafka latency, consumer polling lag, and distributed trace correlation are required.
4. **Compensating Transaction Overhead**:
   - Failures cannot simply `ROLLBACK`. We must write, test, and maintain dedicated compensating logic (refunds, stock release, cancellation state machines).

---

## ❓ Question 4: Idempotent Consumer Design

> **Interview Question**: *"How do you guarantee that replaying a Kafka event 3 times will not charge a customer twice or reserve duplicate inventory?"*

### Implementation in this Project:
1. Every event has a globally unique `id` (e.g. `evt-8f3a9b1c`).
2. Each consumer database has a `processed_events` table:
   ```sql
   CREATE TABLE processed_events (
     event_id VARCHAR(64) NOT NULL,
     event_type VARCHAR(64) NOT NULL,
     aggregate_id VARCHAR(64) NOT NULL,
     handler_name VARCHAR(128) NOT NULL,
     processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (event_id, handler_name)
   );
   ```
3. Inside the consumer handler, before modifying business state:
   - Begin SQL transaction.
   - Query `SELECT event_id FROM processed_events WHERE event_id = $1 AND handler_name = $2 FOR UPDATE`.
   - If row exists: Log `"Duplicate event ignored"`, commit immediately, and skip domain logic.
   - If row does not exist: Insert into `processed_events`, execute business update (e.g. update inventory or insert payment), and `COMMIT` in the same atomic transaction.

---

## ❓ Question 5: Dead Letter Queue (DLQ) & Poison Pill Mitigation

> **Interview Question**: *"What is a poison pill message in Kafka, and how does your DLQ strategy handle it?"*

### Solution:
- A **poison pill** is a malformed message or an unexpected payload that causes a consumer to throw an unhandled exception every time it is read.
- Without a DLQ, the consumer will either crash in a restart loop or block the partition indefinitely (consumer lag grows to infinity).
- **Our Strategy**:
  1. Exponential backoff retry (up to 3-5 attempts with jitter).
  2. If all retries fail, intercept error, wrap payload with error reason, failed timestamp, and original topic.
  3. Publish to `order-processing.dlq`.
  4. Commit Kafka consumer offset so partition processing continues uninterrupted.
  5. Use our CLI tool (`npm run dlq:inspect` / `npm run dlq:replay`) to debug and replay once fixed.
