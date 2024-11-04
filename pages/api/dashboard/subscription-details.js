import { validateApiRequest } from '@/lib/auth';
import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validation = await validateApiRequest(req);
    if (validation.error) return res.status(401).json(validation);
  
    const user = validation.user;

    const result = await db.query(
      db.sql`
        SELECT 
          id,
          status,
          current_period_start,
          current_period_end,
          subscription_id,
          payment_id,
          subscription_type as plan_name,
          plan_name as display_name,
          COALESCE(
            (
              SELECT COUNT(*) 
              FROM short_urls 
              WHERE user_id = us.user_id 
              AND created_at >= NOW() - INTERVAL '24 hours'
            ),
            0
          ) as used_urls
        FROM active_subscriptions us
        WHERE us.user_id = ${user.id}
        ORDER BY current_period_end DESC
        LIMIT 1
      `
    );

    if (result.rows.length === 0) {
      return res.json({ subscription: null });
    }

    return res.json({ subscription: result.rows[0] });
  } catch (error) {
    console.error('Failed to fetch subscription details:', error);
    return res.status(500).json({ error: 'Failed to fetch subscription details' });
  }
}