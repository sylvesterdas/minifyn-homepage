import apiVersionMiddleware from '@/middleware/apiVersionMiddleware';
import apiMiddleware from '@/middleware/apiMiddleware';
import errorMiddleware from '@/middleware/errorMiddleware';
import { getUrlDetails, deactivateUrls } from '@/lib/services/urlService';
import { validateApiKeyPermissions } from '@/lib/services/authService';
import { APIError } from '@/lib/services/errorHandler';

async function handler(req, res) {
  const { shortCode } = req.query;
  const withAnalytics = req.query.analytics === 'true';

  await validateApiKeyPermissions(req.headers['x-api-key'], ['api_access']);
  if (withAnalytics) {
    await validateApiKeyPermissions(req.headers['x-api-key'], ['basic_analytics']);
  }

  switch (req.method) {
    case 'GET':
      const details = await getUrlDetails(shortCode, withAnalytics);
      if (!details) {
        throw new APIError('URL not found', 404, 'NOT_FOUND');
      }
      return res.json(details);

    case 'DELETE':
      await deactivateUrls([shortCode], req.apiKey.user_id);
      return res.status(204).end();

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default errorMiddleware(apiVersionMiddleware(apiMiddleware(handler)));