import db from '../db';
import { kv } from '@vercel/kv';

const CACHE_TTL = 3600; // 1 hour

export async function getSubscriptionLimits(subscriptionType = 'anonymous') {
  const cacheKey = `limits:${subscriptionType}`;
  const cached = await kv.get(cacheKey);
  if (cached) return cached;

  if (subscriptionType === 'anonymous') {
    const limits = {
      dailyUrls: 2,
      batchSize: 1,
      expiryDays: 30,
      apiCalls: 0
    };
    await kv.set(cacheKey, limits, { ex: CACHE_TTL });
    return limits;
  }

  const { rows } = await db.query(db.sql`
    SELECT limit_type, limit_value
    FROM subscription_limits sl
    JOIN subscription_types st ON sl.subscription_type_id = st.id
    WHERE st.name = ${subscriptionType}
  `);

  const limits = {
    dailyUrls: rows.find(r => r.limit_type === 'urls_per_day')?.limit_value || 0,
    batchSize: rows.find(r => r.limit_type === 'urls_per_day')?.limit_value || 0,
    expiryDays: rows.find(r => r.limit_type === 'link_validity_days')?.limit_value || 0,
    apiCalls: rows.find(r => r.limit_type === 'api_calls_per_month')?.limit_value || 0
  };

  await kv.set(cacheKey, limits, { ex: CACHE_TTL });
  return limits;
}