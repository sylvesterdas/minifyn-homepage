import { validateApiRequest } from '@/lib/auth';
import db from '@/lib/db';
import Razorpay from 'razorpay';
import { kv } from '@vercel/kv';
import { getRazorpayPlanId } from '@/constants/plans';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_RAZORPAY_KEY_ID,
  key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  const validation = await validateApiRequest(req);
  if (validation.error) return res.status(401).json(validation);

  const user = validation.user;
  const userId = user.id;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subscriptions = await razorpay.subscriptions.all({
      plan_id: getRazorpayPlanId('pro', 'monthly'),
      count: 100
    });

    const userSubscription = subscriptions.items.find(sub => {
      const notes = sub.notes || {};
      return (notes.customer_id === userId) &&
        ['created', 'authenticated', 'active'].includes(sub.status);
    });

    if (!userSubscription) {
      return res.json({ 
        success: false, 
        message: 'No active subscription found in Razorpay' 
      });
    }

    const paymentDetails = await razorpay.payments.all({
      subscription_id: userSubscription.id
    });

    const validPayments = paymentDetails.items.filter(payment => 
      payment.notes?.customer_id === userId
    );

    if (!validPayments.length) {
      return res.json({
        success: false,
        message: 'No matching payment found for this subscription'
      });
    }

    await db.query(db.sql`BEGIN`);

    try {
      // Get subscription type id first
      const { rows: [subType] } = await db.query(db.sql`
        SELECT id FROM subscription_types WHERE name = 'pro' LIMIT 1
      `);

      // Insert or update subscription
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
          ${subType.id},
          ${userSubscription.id},
          ${userSubscription.payment_id},
          'active',
          to_timestamp(${userSubscription.start_at})::timestamp,
          to_timestamp(${userSubscription.end_at})::timestamp,
          NOW(),
          NOW()
        )
        ON CONFLICT (subscription_id)
        DO UPDATE SET
          status = 'active',
          payment_id = ${userSubscription.payment_id},
          current_period_start = to_timestamp(${userSubscription.start_at})::timestamp,
          current_period_end = to_timestamp(${userSubscription.end_at})::timestamp,
          updated_at = NOW()
        RETURNING *
      `);

      // Deactivate other active subscriptions
      await db.query(db.sql`
        UPDATE user_subscriptions
        SET 
          status = 'inactive',
          updated_at = NOW()
        WHERE 
          user_id = ${userId}
          AND id != ${subscription.id}
          AND status = 'active'
          AND subscription_id != ${userSubscription.id}
      `);

      // Process payments and create/update invoices
      for (const payment of validPayments) {
        if (payment.status === 'captured') {
          const paymentDetails = await razorpay.payments.fetch(payment.id);
          await db.query(db.sql`
            INSERT INTO invoices (
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
              ${userId},
              ${subscription.id},
              ${paymentDetails.amount},
              ${paymentDetails.currency},
              ${paymentDetails.status},
              ${paymentDetails.id},
              to_timestamp(${paymentDetails.created_at})::timestamp,
              to_timestamp(${paymentDetails.created_at})::timestamp,
              NOW(),
              NOW()
            )
            ON CONFLICT (payment_id)
            DO UPDATE SET
              status = ${paymentDetails.status},
              updated_at = NOW()
          `);
        }
      }

      await db.query(db.sql`COMMIT`);

      // Update session
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

      return res.json({
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
    console.error('Sync subscription error:', error);
    return res.status(500).json({ error: 'Failed to sync subscription' });
  }
}