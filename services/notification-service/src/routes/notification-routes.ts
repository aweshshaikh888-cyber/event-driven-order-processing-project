import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

export function createNotificationRouter(pool: Pool): Router {
  const router = Router();

  // GET /api/v1/notifications - List all notifications
  router.get('/notifications', async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await pool.query(
        `SELECT id, order_id as "orderId", event_type as "eventType", recipient, channel, subject, message_body as "messageBody", created_at as "createdAt"
         FROM notifications 
         ORDER BY created_at DESC LIMIT 50`
      );
      res.json({ notifications: result.rows });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/notifications/order/:orderId - List notifications for a specific order
  router.get('/notifications/order/:orderId', async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId } = req.params;
      const result = await pool.query(
        `SELECT id, order_id as "orderId", event_type as "eventType", recipient, channel, subject, message_body as "messageBody", created_at as "createdAt"
         FROM notifications 
         WHERE order_id = $1 
         ORDER BY created_at ASC`,
        [orderId]
      );
      res.json({ notifications: result.rows });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
