import db from '@/lib/db';
import { cleanupSessions } from '@/lib/auth';
import { flushAnalyticsBuffer } from '@/lib/analytics';
import Promise from 'bluebird';

export default async function handler(req, res) {
  // Check if request is from Vercel Cron
  const isVercelCron = req.headers['x-vercel-cron'] === '1';
  
  // Verify authorization header
  const authHeader = req.headers.authorization;
  const isValidSecret = 
    authHeader && 
    authHeader.startsWith('Bearer ') && 
    authHeader.split(' ')[1] === process.env.CRON_SECRET;

  // In production, require both Vercel cron header and valid secret
  if (process.env.NODE_ENV === 'production' && (!isVercelCron || !isValidSecret)) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      context: 'Only Vercel cron jobs can access this endpoint'
    });
  }

  try {

    await Promise.all([
      // Delete expired URLs using the existing database function
      db.query(db.sql`SELECT delete_expired_short_urls()`),
      // Cleanup old sessions
      cleanupSessions(),
      // Flush analytics buffer
      flushAnalyticsBuffer()
    ]);

    res.status(200).json({ 
      message: 'Maintenance tasks completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Maintenance job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}