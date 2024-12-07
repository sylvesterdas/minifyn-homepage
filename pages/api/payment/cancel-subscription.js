import { kv } from '@vercel/kv';
import db from '@/lib/db';
import Razorpay from 'razorpay';

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

      const freePlanStart = currentSub.current_period_end ? new Date(currentSub.current_period_end) : null;
      const freePlanEnd = freePlanStart ? new Date(freePlanStart.setDate(freePlanStart.getDate() + 60)) : null;

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

      const d = new Date(currentSub.current_period_end).toLocaleDateString(getLocaleFromRequest(req), {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      return res.status(200).json({ 
        success: true,
        message: `Your Pro subscription has been cancelled. Your Pro features will remain active until ${d}, after which you will be moved to the Free plan.`
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

const getLocaleFromRequest = (req) => {
  // Check Accept-Language header
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0];
    return preferredLocale.replace('_', '-');
  }
  
  // Check if locale is available in the URL (Next.js i18n)
  const locale = req.headers['x-next-locale'] || req.query.locale;
  if (locale) {
    return locale;
  }
  
  return 'en-IN';
}
