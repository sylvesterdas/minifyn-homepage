import { validateApiRequest } from '@/lib/auth';
import { getUserUrls, deleteUserUrl, updateUrl } from '@/lib/services/urlDashboardService';

export default async function handler(req, res) {
  const validation = await validateApiRequest(req);
  if (validation.error) return res.status(401).json(validation);

  const userId = validation.session.userId;

  try {
    switch (req.method) {
      case 'GET':
        const { page, limit, search } = req.query;
        const urls = await getUserUrls({
          userId,
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
          search: search || ''
        });

        return res.status(200).json(urls);

      case 'DELETE':
        const { shortCode } = req.body;
        if (!shortCode) {
          return res.status(400).json({ error: 'Short code is required' });
        }
        const deleted = await deleteUserUrl(userId, shortCode);
        if (!deleted) {
          return res.status(404).json({ error: 'URL not found' });
        }
        return res.status(200).json({ success: true });

      case 'PATCH':
        const { shortCode: code, ...updates } = req.body;
        if (!code) {
          return res.status(400).json({ error: 'Short code is required' });
        }
        const updated = await updateUrl(userId, code, updates);
        if (!updated) {
          return res.status(404).json({ error: 'URL not found' });
        }
        return res.status(200).json(updated);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Dashboard URLs API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}