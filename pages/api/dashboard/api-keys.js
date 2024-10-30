import { validateApiRequest } from '@/lib/auth';
import { nanoid } from 'nanoid';
import { getApiKeys, createApiKey, deleteApiKey } from '@/lib/apiKeysService';

export default async function handler(req, res) {
  const validation = await validateApiRequest(req);
  if (validation.error) return res.status(401).json(validation);

  const userId = validation.session.userId;

  try {
    switch (req.method) {
      case 'GET':
        const keys = await getApiKeys(userId);
        return res.json(keys);

      case 'POST':
        const { name } = JSON.parse(req.body);
        if (!name?.trim()) {
          return res.status(400).json({ error: 'Name is required' });
        }
        const key = `mnfy_${nanoid(32)}`;
        const newKey = await createApiKey(userId, name.trim(), key);
        return res.json(newKey);

      case 'DELETE':
        const { keyId } = JSON.parse(req.body);
        if (!keyId) {
          return res.status(400).json({ error: 'Key ID is required' });
        }
        await deleteApiKey(userId, keyId);
        return res.json({ success: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Keys Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}