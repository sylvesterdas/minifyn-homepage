import { validateApiRequest } from '@/lib/auth';
import db from '@/lib/db';
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const validation = await validateApiRequest(req);
  if (validation.error) return res.status(401).json(validation);

  const userId = validation.session.userId;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId, subscriptionId } = req.body;

    if (!paymentId || !subscriptionId) {
      return res.status(400).json({ error: 'Payment and subscription details required' });
    }

    // Start transaction
    await db.query(db.sql`BEGIN`);

    try {
      // Update user subscription
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
        SELECT
          ${userId},
          (SELECT id FROM subscription_types WHERE name = 'pro' LIMIT 1),
          ${subscriptionId},
          ${paymentId},
          'active',
          NOW(),
          NOW() + INTERVAL '1 month',
          NOW(),
          NOW()
        RETURNING *
      `);

      // Create invoice record
      await db.query(db.sql`
        INSERT INTO invoices (
          id,
          user_id,
          subscription_id,
          amount,
          currency,
          status,
          payment_id,
          invoice_date,
          paid_at,
          created_at,
          updated_at
        )
        VALUES (
          gen_random_uuid(),
          ${userId},
          ${subscription.id},
          9900,
          'INR',
          'paid',
          ${paymentId},
          NOW(),
          NOW(),
          NOW(),
          NOW()
        )
      `);

      // Deactivate any existing subscriptions
      await db.query(db.sql`
        UPDATE user_subscriptions
        SET status = 'inactive',
            updated_at = NOW()
        WHERE user_id = ${userId}
        AND id != ${subscription.id}
        AND status = 'active'
      `);

      await db.query(db.sql`COMMIT`);

      // Update session with new subscription info
      const sessionId = req.cookies.sessionId;
      if (sessionId) {
        const session = await kv.get(`session:${sessionId}`);
        if (session) {
          await kv.set(`session:${sessionId}`, {
            ...session,
            subscription: {
              id: subscription.id,
              type: 'pro',
              periodEnd: subscription.current_period_end
            }
          });
        }
      }

      return res.status(200).json({
        success: true,
        subscription: {
          id: subscription.id,
          type: 'pro',
          periodEnd: subscription.current_period_end
        }
      });

    } catch (error) {
      await db.query(db.sql`ROLLBACK`);
      throw error;
    }

  } catch (error) {
    console.error('Payment success handler error:', error);
    return res.status(500).json({ error: 'Failed to process payment success' });
  }
}