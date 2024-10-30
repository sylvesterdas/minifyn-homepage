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
      SELECT u.id, st.name as subscription_type
      FROM users u
      JOIN user_subscriptions us ON u.id = us.user_id
      JOIN subscription_types st ON us.subscription_type_id = st.id
      WHERE u.id = ${req.session?.userId}
      AND us.status = 'active'
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