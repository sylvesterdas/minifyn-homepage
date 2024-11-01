import { validateApiRequest } from '@/lib/auth';
import db from '@/lib/db';

export default async function handler(req, res) {
  const validation = await validateApiRequest(req);
  if (validation.error) return res.status(401).json(validation);

  const userId = validation.user.id;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rows: transactions } = await db.query(db.sql`
      WITH active_subscription AS (
        SELECT id, subscription_id
        FROM user_subscriptions
        WHERE user_id = ${userId}::uuid
          AND status = 'active'
        LIMIT 1
      )
      SELECT 
        i.id,
        i.status,
        i.created_at,
        i.payment_id,
        us.subscription_id,
        CASE 
          WHEN us.subscription_id = (SELECT subscription_id FROM active_subscription) THEN true 
          ELSE false 
        END as is_current
      FROM invoices i
      JOIN user_subscriptions us ON us.subscription_id = i.subscription_id
      WHERE i.user_id = ${userId}::uuid
        AND i.status = 'captured'
      ORDER BY i.created_at DESC
      LIMIT 5
    `);

    return res.json({ transactions });
    
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return res.status(500).json({ 
      error: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Internal server error' 
    });
  }
}