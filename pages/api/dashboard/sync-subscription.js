import { validateApiRequest } from '@/lib/auth';
import db from '@/lib/db';
import Razorpay from 'razorpay';
import { kv } from '@vercel/kv';

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

    // First try to get customer ID if exists
    let customerQuery = await razorpay.customers.all({
      email: user.email
    });

    console.log(customerQuery);

    let userSubscription;
    
    if (customerQuery.items?.length > 0) {
      // If customer exists, get their subscriptions directly
      const customer = customerQuery.items[0];
      const customerSubscriptions = await razorpay.subscriptions.all({
        customer_id: customer.id,
        plan_id: 'plan_PFBadEYZNEmHwI'
      });
      
      userSubscription = customerSubscriptions.items.find(sub => 
        sub.status === 'active' || sub.status === 'authenticated'
      );
    } else {
      // Fallback: check subscriptions with email in notes
      // This is for older subscriptions before customer was created
      const subscriptions = await razorpay.subscriptions.all({
        count: 100
      });
      
      userSubscription = subscriptions.items.find(sub => 
        sub.notes?.email === user.email && 
        (sub.status === 'active' || sub.status === 'authenticated')
      );
    }

    if (!userSubscription) {
      return res.json({ 
        success: false, 
        message: 'No active subscription found in Razorpay' 
      });
    }

    // Verify the subscription payment belongs to the right customer/email
    const paymentDetails = await razorpay.payments.all({
      subscription_id: userSubscription.id
    });

    const validPayment = paymentDetails.items.find(payment => 
      payment.email === user.email || 
      payment.customer_id === userSubscription.customer_id
    );

    if (!validPayment) {
      return res.json({
        success: false,
        message: 'No matching payment found for this subscription'
      });
    }

    // Start transaction
    await db.query(db.sql`BEGIN`);

    try {
      // UPSERT subscription record
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
          (SELECT id FROM subscription_types WHERE name = 'pro' LIMIT 1),
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

      // Clear any inactive subscription statuses for this user
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

      // Process each payment and create/update invoices
      for (const payment of validPayment.items) {
        // Only process captured/successful payments
        if (payment.status === 'captured') {
          const paymentDetails = await razorpay.payments.fetch(payment.id);
          // UPSERT invoice record
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