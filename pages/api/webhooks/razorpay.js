import db from '@/lib/db';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false // Use raw body for webhook signature verification
  }
};

const getRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    // Get the raw body for signature verification
    const rawBody = await getRawBody(req);
    const body = JSON.parse(rawBody);

    // Verify webhook signature
    const webhookSecret = process.env.JWT_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    switch (body.event) {
      case 'subscription.authenticated':
        // When subscription is first created and authenticated
        await handleSubscriptionAuthenticated(body.payload.subscription.entity);
        break;

      case 'subscription.charged':
        // When a subscription payment is successful
        await handleSubscriptionCharged(body.payload);
        break;

      case 'subscription.cancelled':
        // When a subscription is cancelled
        await handleSubscriptionCancelled(body.payload.subscription.entity);
        break;

      case 'subscription.paused':
        // When a subscription is paused
        await handleSubscriptionPaused(body.payload.subscription.entity);
        break;

      case 'subscription.resumed':
        // When a paused subscription is resumed
        await handleSubscriptionResumed(body.payload.subscription.entity);
        break;

      default:
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook handler failed' });
  }
}

async function handleSubscriptionAuthenticated(subscription) {
  await db.query(db.sql`
    UPDATE user_subscriptions
    SET 
      status = 'active',
      current_period_start = ${new Date(subscription.current_start * 1000)},
      current_period_end = ${new Date(subscription.current_end * 1000)},
      updated_at = NOW()
    WHERE subscription_id = ${subscription.id}
  `);
}

async function handleSubscriptionCharged(payload) {
  const { subscription, payment } = payload;
  const subscriptionEntity = subscription.entity;
  const paymentEntity = payment.entity;

  await db.query(db.sql`BEGIN`);

  try {
    // Update subscription
    await db.query(db.sql`
      UPDATE user_subscriptions
      SET 
        status = 'active',
        current_period_start = ${new Date(subscriptionEntity.current_start * 1000)},
        current_period_end = ${new Date(subscriptionEntity.current_end * 1000)},
        payment_id = ${paymentEntity.id},
        updated_at = NOW()
      WHERE subscription_id = ${subscriptionEntity.id}
    `);

    // Create invoice record
    await db.query(db.sql`
      INSERT INTO invoices (
        user_id,
        amount,
        currency,
        status,
        invoice_date,
        paid_at,
        payment_id,
        subscription_id
      )
      SELECT 
        user_id,
        ${paymentEntity.amount / 100},
        ${paymentEntity.currency},
        'paid',
        NOW(),
        ${new Date(paymentEntity.created_at * 1000)},
        ${paymentEntity.id},
        ${subscriptionEntity.id}
      FROM user_subscriptions
      WHERE subscription_id = ${subscriptionEntity.id}
    `);

    await db.query(db.sql`COMMIT`);
  } catch (error) {
    await db.query(db.sql`ROLLBACK`);
    throw error;
  }
}

async function handleSubscriptionCancelled(subscription) {
  await db.query(db.sql`
    UPDATE user_subscriptions
    SET 
      status = 'cancelled',
      updated_at = NOW()
    WHERE subscription_id = ${subscription.id}
  `);
}

async function handleSubscriptionPaused(subscription) {
  await db.query(db.sql`
    UPDATE user_subscriptions
    SET 
      status = 'paused',
      updated_at = NOW()
    WHERE subscription_id = ${subscription.id}
  `);
}

async function handleSubscriptionResumed(subscription) {
  await db.query(db.sql`
    UPDATE user_subscriptions
    SET 
      status = 'active',
      current_period_start = ${new Date(subscription.current_start * 1000)},
      current_period_end = ${new Date(subscription.current_end * 1000)},
      updated_at = NOW()
    WHERE subscription_id = ${subscription.id}
  `);
}