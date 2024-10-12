import { getSession } from '@/lib/auth';
import { getDashboardData } from '@/lib/dashboardService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const session = await getSession(req.cookies.sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const dashboardData = await getDashboardData(session.userId);
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}