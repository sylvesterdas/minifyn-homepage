import db from '@/lib/db';
import Razorpay from 'razorpay';
import { kv } from '@vercel/kv';
import { getRazorpayPlanId } from '@/constants/plans';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_RAZORPAY_KEY_ID,
  key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET,
});

const SYNC_LOCK_KEY = 'subscription:sync:lock';
const LAST_SYNC_KEY = 'subscription:last_sync';

// Razorpay timestamp constraints
const MIN_TIMESTAMP = 946684800; // Jan 1, 2000
const MAX_TIMESTAMP = 4765046400; // Jan 1, 2120

function getSafeTimestamp(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  if (!timestamp) return Math.max(MIN_TIMESTAMP, now - (30 * 24 * 60 * 60));
  return Math.max(MIN_TIMESTAMP, Math.min(timestamp, MAX_TIMESTAMP));
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron request
  const isVercelCron = req.headers['x-vercel-cron'] === '1';
  const authHeader = req.headers.authorization;
  const isValidSecret = 
    authHeader && 
    authHeader.startsWith('Bearer ') && 
    authHeader.split(' ')[1] === process.env.CRON_SECRET;

  if ((process.env.NODE_ENV === 'production' && !isVercelCron) || !isValidSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const stats = {
    subscriptionsFound: 0,
    subscriptionsProcessed: 0,
    subscriptionsSkipped: 0,
    paymentsProcessed: 0,
    skippedReasons: {}
  };

  try {
    // Implement distributed lock
    const lock = await kv.set(SYNC_LOCK_KEY, 1, { nx: true, ex: 600 });
    if (!lock) {
      return res.status(429).json({ error: 'Sync already in progress' });
    }

    try {
      const lastSyncRaw = await kv.get(LAST_SYNC_KEY);
      const lastSync = getSafeTimestamp(lastSyncRaw);
      const now = Math.floor(Date.now() / 1000);

      // Get subscription type id once
      const { rows: [subType] } = await db.query(db.sql`
        SELECT id FROM subscription_types WHERE name = 'pro' LIMIT 1
      `);

      let hasMore = true;
      let skip = 0;
      const planId = getRazorpayPlanId('pro', 'monthly');

      while (hasMore) {
        const subscriptions = await razorpay.subscriptions.all({
          plan_id: planId,
          count: 100,
          skip,
          from: lastSync
        });

        stats.subscriptionsFound += subscriptions.items.length;

        if (!subscriptions.items.length) {
          hasMore = false;
          continue;
        }

        // Process subscriptions in batches
        await db.query(db.sql`BEGIN`);
        
        try {
          for (const subscription of subscriptions.items) {
            const userId = subscription.notes?.customer_id;
            
            // Skip if no customer_id in notes
            if (!userId) {
              stats.subscriptionsSkipped++;
              stats.skippedReasons.noCustomerId = (stats.skippedReasons.noCustomerId || 0) + 1;
              continue;
            }

            // Check if user exists in our system
            const { rows: [existingUser] } = await db.query(db.sql`
              SELECT id FROM users WHERE id = ${userId}
            `);

            if (!existingUser) {
              stats.subscriptionsSkipped++;
              stats.skippedReasons.userNotFound = (stats.skippedReasons.userNotFound || 0) + 1;
              continue;
            }

            const start = getSafeTimestamp(subscription.current_start || subscription.start_at || now);
            const end = getSafeTimestamp(subscription.current_end || subscription.end_at || (start + (30 * 24 * 60 * 60)));

            // Update subscription
            const { rows: [dbSub] } = await db.query(db.sql`
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
                ${subscription.id},
                ${subscription.payment_id},
                ${subscription.status},
                to_timestamp(${start})::timestamp,
                to_timestamp(${end})::timestamp,
                NOW(),
                NOW()
              )
              ON CONFLICT (subscription_id)
              DO UPDATE SET
                status = ${subscription.status},
                payment_id = ${subscription.payment_id},
                current_period_start = to_timestamp(${start})::timestamp,
                current_period_end = to_timestamp(${end})::timestamp,
                updated_at = NOW()
              RETURNING *
            `);

            // Process payments
            const payments = await razorpay.payments.all({
              subscription_id: subscription.id,
              from: lastSync,
              count: 100
            });

            for (const payment of payments.items) {
              if (payment.status === 'captured') {
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
                    ${dbSub.id},
                    ${payment.amount},
                    ${payment.currency},
                    ${payment.status},
                    ${payment.id},
                    to_timestamp(${getSafeTimestamp(payment.created_at)})::timestamp,
                    to_timestamp(${getSafeTimestamp(payment.created_at)})::timestamp,
                    NOW(),
                    NOW()
                  )
                  ON CONFLICT (payment_id)
                  DO UPDATE SET
                    status = ${payment.status},
                    updated_at = NOW()
                `);
                stats.paymentsProcessed++;
              }
            }

            stats.subscriptionsProcessed++;
          }

          await db.query(db.sql`COMMIT`);
        } catch (error) {
          await db.query(db.sql`ROLLBACK`);
          throw error;
        }

        skip += subscriptions.items.length;
        hasMore = subscriptions.items.length === 100;
      }

      // Update last sync time
      await kv.set(LAST_SYNC_KEY, now);

      return res.json({ 
        success: true, 
        syncedAt: now,
        syncedAtFormatted: new Date(now * 1000).toISOString(),
        lastSync,
        lastSyncFormatted: new Date(lastSync * 1000).toISOString(),
        stats
      });

    } finally {
      await kv.del(SYNC_LOCK_KEY);
    }

  } catch (error) {
    console.error('Subscription sync error:', error);
    return res.status(500).json({ 
      error: 'Sync failed', 
      details: error,
      message: error.message,
      stats 
    });
  }
}