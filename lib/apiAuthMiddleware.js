import db from './db';

async function validateApiKey(key) {
  const { rows } = await db.query(db.sql`
    SELECT 
      ak.id, ak.user_id, ak.daily_usage, ak.monthly_usage,
      us.subscription_type,
      sl.limit_value
    FROM api_keys ak
    JOIN active_subscriptions us ON ak.user_id = us.user_id
    JOIN subscription_limits sl ON us.subscription_type_id = sl.subscription_type_id
    WHERE ak.key = ${key} 
    AND ak.is_active = true
    AND sl.limit_type = 'api_calls_per_month'
  `);

  if (!rows[0]) return { error: 'Invalid API key' };
  
  return rows[0];
}

export default function apiAuthMiddleware(handler) {
  return async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) return handler(req, res);

    try {
      const keyData = await validateApiKey(apiKey);
      
      if (keyData.error) {
        return res.status(401).json({ error: keyData.error });
      }

      req.apiKey = keyData;
      return handler(req, res);
    } catch (error) {
      console.error('API auth error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}