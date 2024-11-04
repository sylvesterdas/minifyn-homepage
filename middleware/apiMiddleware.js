import { kv } from '@vercel/kv';
import db from '@/lib/db';
import { APIError } from '@/lib/services/errorHandler';
import { getSubscriptionLimits } from '@/lib/services/subscriptionService';

export default function apiMiddleware(handler) {
  return async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      throw new APIError('API key required', 401, 'UNAUTHORIZED');
    }

    try {
      const { rows } = await db.query(db.sql`
        SELECT 
          ak.id, ak.user_id, 
          us.subscription_type
        FROM api_keys ak
        JOIN active_subscriptions us ON ak.user_id = us.user_id
        WHERE ak.key = ${apiKey} 
        AND ak.is_active = true
      `);
     
      if (!rows[0]) {
        throw new APIError('Invalid API key', 401, 'UNAUTHORIZED');
      }

      const keyData = rows[0];
      const monthKey = `api:${keyData.id}:${new Date().getMonth()}`;
      const count = await kv.incr(monthKey);
      
      if (count === 1) {
        await kv.expire(monthKey, 2592000);
      }

      const limits = await getSubscriptionLimits(keyData.subscription_type);
      if (count > limits.apiCalls) {
        throw new APIError('Monthly API limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
      }

      req.apiKey = {
        ...keyData,
        subscription_type: keyData.subscription_type
      };
      
      return handler(req, res);
    } catch (error) {
      throw new APIError(error.message || 'Internal server error', error.statusCode || 500, error.code || 'INTERNAL_ERROR');
    }
  };
}