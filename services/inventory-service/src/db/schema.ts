import { Pool } from 'pg';
import { OutboxRepository, IdempotentConsumer } from '@order-system/shared';

export async function initInventoryDatabase(pool: Pool): Promise<void> {
  await OutboxRepository.initSchema(pool);
  await IdempotentConsumer.initSchema(pool);

  const sql = `
    CREATE TABLE IF NOT EXISTS inventory_items (
      item_id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(128) NOT NULL,
      available_quantity INT NOT NULL,
      reserved_quantity INT NOT NULL DEFAULT 0,
      price NUMERIC(10, 2) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inventory_reservations (
      reservation_id VARCHAR(64) PRIMARY KEY,
      order_id VARCHAR(64) NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'RESERVED',
      items JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_inv_res_order ON inventory_reservations(order_id);
  `;
  await pool.query(sql);

  // Seed default inventory items
  await seedDefaultInventory(pool);
  console.log('[Inventory DB] Tables and default inventory initialized');
}

export async function seedDefaultInventory(pool: Pool): Promise<void> {
  const seedItems = [
    { id: 'item-1', name: 'MacBook Pro M3 Max', available: 50, price: 2499.00 },
    { id: 'item-2', name: 'Sony WH-1000XM5 Headphones', available: 20, price: 399.00 },
    { id: 'item-scarce', name: 'Limited Edition Keychron Q1 Pro', available: 2, price: 199.00 },
    { id: 'item-out-of-stock', name: 'NVIDIA RTX 5090 (Sold Out)', available: 0, price: 1999.00 },
  ];

  for (const item of seedItems) {
    await pool.query(
      `INSERT INTO inventory_items (item_id, name, available_quantity, reserved_quantity, price)
       VALUES ($1, $2, $3, 0, $4)
       ON CONFLICT (item_id) DO UPDATE 
       SET available_quantity = EXCLUDED.available_quantity,
           reserved_quantity = 0,
           price = EXCLUDED.price,
           updated_at = CURRENT_TIMESTAMP;`,
      [item.id, item.name, item.available, item.price]
    );
  }
}
