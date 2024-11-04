import db from '@/lib/db';
import { validateApiRequest } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validation = await validateApiRequest(req);
    if (validation.error) return res.status(401).json(validation);

    const { paymentId, subscriptionId, planId } = req.body;
    const userId = validation.user.id;

    await db.query(db.sql`BEGIN`);

    try {
      // Update or insert subscription
      const { rows: [subscription] } = await db.query(db.sql`
        INSERT INTO user_subscriptions (
          user_id,
          subscription_type_id,
          subscription_id,
          payment_id,
          status,
          current_period_start,
          current_period_end,
          created_at,
          updated_at
        )
        VALUES (
          ${userId},
          (SELECT id FROM subscription_types WHERE name = ${planId}),
          ${subscriptionId},
          ${paymentId},
          'active',
          NOW(),
          NOW() + INTERVAL '30 days',
          NOW(),
          NOW()
        )
        ON CONFLICT (subscription_id) 
        DO UPDATE SET
          payment_id = EXCLUDED.payment_id,
          updated_at = NOW()
        RETURNING *
      `);

      // Deactivate any other active subscriptions
      await db.query(db.sql`
        UPDATE user_subscriptions
        SET 
          status = 'inactive',
          updated_at = NOW()
        WHERE 
          user_id = ${userId}
          AND id != ${subscription.id}
          AND status = 'active'
      `);

      await db.query(db.sql`COMMIT`);

      return res.status(200).json({ 
        success: true,
        subscription 
      });
    } catch (error) {
      await db.query(db.sql`ROLLBACK`);
      throw error;
    }
  } catch (error) {
    console.error('Payment success handling failed:', error);
    return res.status(500).json({ error: 'Failed to process payment' });
  }
}