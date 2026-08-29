import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

export function createPaymentRouter(pool: Pool): Router {
  const router = Router();

  // GET /api/v1/payments/:orderId - Retrieve payment for order
  router.get('/payments/:orderId', async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId } = req.params;
      const result = await pool.query(
        `SELECT id, order_id as "orderId", amount, status, payment_method as "paymentMethod", 
                failure_reason as "failureReason", created_at as "createdAt"
         FROM payments 
         WHERE order_id = $1 
         ORDER BY created_at DESC`,
        [orderId]
      );
      res.json({ payments: result.rows });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/chaos/delay - Inject latency for slow payment simulation
  router.post('/chaos/delay', async (req: Request, res: Response): Promise<void> => {
    try {
      const { delayMs } = req.body;
      const ms = parseInt(delayMs, 10) || 0;
      await pool.query(`UPDATE chaos_settings SET delay_ms = $1 WHERE id = 1`, [ms]);
      res.json({ success: true, message: `Payment processing latency set to ${ms}ms` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/chaos/fail-next - Force next payment to fail
  router.post('/chaos/fail-next', async (req: Request, res: Response): Promise<void> => {
    try {
      const count = parseInt(req.body.count || '1', 10);
      await pool.query(`UPDATE chaos_settings SET fail_next_count = fail_next_count + $1 WHERE id = 1`, [count]);
      res.json({
        success: true,
        message: `Next ${count} payment(s) will fail with simulated decline to test Saga compensation.`,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/chaos/reset - Reset chaos
  router.post('/chaos/reset', async (req: Request, res: Response): Promise<void> => {
    try {
      await pool.query(`UPDATE chaos_settings SET delay_ms = 0, fail_next_count = 0 WHERE id = 1`);
      res.json({ success: true, message: 'Payment chaos simulation reset to normal.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
