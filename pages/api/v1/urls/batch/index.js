import apiVersionMiddleware from '@/middleware/apiVersionMiddleware';
import apiMiddleware from '@/middleware/apiMiddleware';
import errorMiddleware from '@/middleware/errorMiddleware';
import { validateBatchOperation, executeBatchOperation } from '@/lib/services/batchService';
import { validateApiKeyPermissions } from '@/lib/services/authService';
import { APIError } from '@/lib/services/errorHandler';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await validateApiKeyPermissions(req.headers['x-api-key'], ['api_access', 'bulk_operations']);

  const { action, shortCodes } = req.body;
  if (!Array.isArray(shortCodes) || !shortCodes.length) {
    throw new APIError('Invalid request body', 400, 'INVALID_REQUEST');
  }

  await validateBatchOperation(shortCodes, req.apiKey.user_id, req.apiKey.subscription_type);
  const result = await executeBatchOperation(action, shortCodes, req.apiKey.user_id);
  
  return action === 'delete' ? res.status(204).end() : res.json(result);
}

export default errorMiddleware(apiVersionMiddleware(apiMiddleware(handler)));