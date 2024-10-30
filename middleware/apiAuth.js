import { validateApiKey, incrementApiUsage } from '@/lib/apiKeys';

export async function apiKeyMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return next();

  const keyData = await validateApiKey(apiKey);
  if (keyData.error) {
    return res.status(401).json({ error: keyData.error });
  }

  if (keyData.monthly_usage >= keyData.limit_value) {
    return res.status(429).json({ error: 'API quota exceeded' });
  }

  await incrementApiUsage(keyData.id);
  req.apiKey = keyData;
  next();
}