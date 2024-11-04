import { kv } from '@vercel/kv';
import db from './db';

const LIMITS = {
  anonymous: { daily: 2 },
  free: { daily: 10 },
  pro: { daily: 50 }
};

async function getRateLimit(userId, subscriptionType, clientIp) {
  const today = new Date().toISOString().split('T')[0];
  const identifier = userId || `anon:${clientIp}`;
  const key = `rate:${identifier}:${today}`;

  const count = await kv.incr(key);
  await kv.expire(key, 86400);

  const limit = LIMITS[subscriptionType]?.daily || LIMITS.anonymous.daily;
  return { count, limit, remaining: Math.max(0, limit - count) };
}

export default function rateLimitMiddleware(handler) {
  return async (req, res) => {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    
    if (req.headers['x-api-key']) {
      return handler(req, res);
    }
 
    const validation = await db.query(db.sql`
      SELECT user_id as id, subscription_type
      FROM active_subscriptions
      WHERE user_id = ${req.session?.userId}
      ORDER BY current_period_end DESC
      LIMIT 1
    `);
 
    const user = validation.rows[0];
    const rateLimit = await getRateLimit(
      user?.id,
      user?.subscription_type || 'anonymous',
      clientIp
    );
 
    if (rateLimit.count > rateLimit.limit) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        limit: rateLimit.limit,
        remaining: 0,
        reset: 'Next day'
      });
    }
 
    res.setHeader('X-RateLimit-Limit', rateLimit.limit);
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
 
    return handler(req, res);
  };
}