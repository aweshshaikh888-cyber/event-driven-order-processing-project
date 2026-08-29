import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { seedDefaultInventory } from '../db/schema';

export function createInventoryRouter(pool: Pool): Router {
  const router = Router();

  // GET /api/v1/inventory - List all items & quantities
  router.get('/inventory', async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await pool.query(
        `SELECT item_id as "itemId", name, available_quantity as "availableQuantity", 
                reserved_quantity as "reservedQuantity", price, updated_at as "updatedAt"
         FROM inventory_items 
         ORDER BY item_id ASC`
      );
      res.json({ items: result.rows });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/inventory/reservations - List all reservations
  router.get('/inventory/reservations', async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await pool.query(
        `SELECT reservation_id as "reservationId", order_id as "orderId", status, items, created_at as "createdAt"
         FROM inventory_reservations 
         ORDER BY created_at DESC LIMIT 50`
      );
      res.json({ reservations: result.rows });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/inventory/seed - Reset/reseed stock levels
  router.post('/inventory/seed', async (req: Request, res: Response): Promise<void> => {
    try {
      await seedDefaultInventory(pool);
      res.json({ success: true, message: 'Inventory reseeded to default levels.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
