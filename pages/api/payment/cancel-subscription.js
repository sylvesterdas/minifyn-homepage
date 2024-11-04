import { kv } from '@vercel/kv';
import db from '@/lib/db';
import Razorpay from 'razorpay';
import moment from 'moment';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_RAZORPAY_KEY_ID,
  key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscriptionId } = req.body;

    // Cancel subscription in Razorpay
    // await razorpay.subscriptions.cancel(subscriptionId);

    // Start transaction
    await db.query(db.sql`BEGIN`);

    try {
      // Get current subscription details
      const { rows: [currentSub] } = await db.query(
        db.sql`
          SELECT * FROM user_subscriptions 
          WHERE subscription_id = ${subscriptionId}
        `
      );

      if (!currentSub) {
        throw new Error('Subscription not found');
      }

      // Update current subscription to cancelled
      await db.query(
        db.sql`
          UPDATE user_subscriptions 
          SET 
            cancelled_at = NOW(),
            cancel_at_period_end = true,
            updated_at = NOW()
          WHERE subscription_id = ${subscriptionId}
        `
      );

      // Create free plan subscription starting after current period
      const freePlanStart = currentSub.current_period_end ? moment(currentSub.current_period_end).toDate() : null;
      const freePlanEnd = freePlanStart ? moment(freePlanStart).add(60, 'days').toDate() : null;

      await db.query(
        db.sql`
          INSERT INTO user_subscriptions (
            user_id,
            subscription_type_id,
            status,
            current_period_start,
            current_period_end,
            created_at,
            updated_at
          )
          VALUES (
            ${currentSub.user_id},
            (SELECT id FROM subscription_types WHERE name = 'free' LIMIT 1),
            'active',
            ${freePlanStart},
            ${freePlanEnd},
            NOW(),
            NOW()
          )
        `
      );

      await db.query(db.sql`COMMIT`);

      // Clear any cached subscription data
      await kv.del(`subscription:${currentSub.user_id}`);

      // Update session if exists
      const sessionId = req.cookies.sessionId;
      if (sessionId) {
        const session = await kv.get(`session:${sessionId}`);
        if (session) {
          await kv.set(`session:${sessionId}`, {
            ...session,
            subscription: {
              type: 'pro', // Still pro until period end
              periodEnd: currentSub.current_period_end,
              cancelAtPeriodEnd: true
            }
          }, { 
            ex: 24 * 60 * 60 
          });
        }
      }

      return res.status(200).json({ 
        success: true,
        message: 'Your Pro subscription has been cancelled. Your Pro features will remain active until ' +
                moment(currentSub.current_period_end).format('MMMM D, YYYY') +
                ', after which you will be moved to the Free plan.'
      });

    } catch (error) {
      await db.query(db.sql`ROLLBACK`);
      throw error;
    }

  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    return res.status(500).json({ 
      error: 'Failed to cancel subscription. Please try again or contact support.' 
    });
  }
}