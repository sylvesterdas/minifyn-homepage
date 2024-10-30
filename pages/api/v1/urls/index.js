import apiVersionMiddleware from '@/middleware/apiVersionMiddleware';
import apiMiddleware from '@/middleware/apiMiddleware';
import errorMiddleware from '@/middleware/errorMiddleware';
import { createUrls } from '@/lib/services/urlService';
import { validateApiKeyPermissions } from '@/lib/services/authService';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await validateApiKeyPermissions(req.headers['x-api-key'], ['api_access']);

  const results = await createUrls(
    req.body.urls,
    req.apiKey.user_id,
    req.apiKey.subscription_type
  );
  return res.json(results);
}

export default errorMiddleware(apiVersionMiddleware(apiMiddleware(handler)));