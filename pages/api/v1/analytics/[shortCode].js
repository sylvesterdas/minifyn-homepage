import apiVersionMiddleware from '@/middleware/apiVersionMiddleware';
import apiMiddleware from '@/middleware/apiMiddleware';
import errorMiddleware from '@/middleware/errorMiddleware';
import { getUrlAnalytics } from '@/lib/services/analyticsService';
import { validateApiKeyPermissions } from '@/lib/services/authService';
import { APIError } from '@/lib/services/errorHandler';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await validateApiKeyPermissions(req.headers['x-api-key'], ['api_access', 'detailed_analytics']);

  const { shortCode } = req.query;
  const days = Math.min(parseInt(req.query.days) || 30, 90);
  
  const analytics = await getUrlAnalytics(
    shortCode,
    req.apiKey.user_id,
    req.apiKey.subscription_type,
    days
  );
  
  if (!analytics) {
    throw new APIError('URL not found or unauthorized', 404, 'NOT_FOUND');
  }

  return res.json(analytics);
}

export default errorMiddleware(apiVersionMiddleware(apiMiddleware(handler)));