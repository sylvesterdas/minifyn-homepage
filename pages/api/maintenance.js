import db from '@/lib/db';
import { cleanupSessions } from '@/lib/auth';
import { flushAnalyticsBuffer } from '@/lib/analytics';
import Promise from 'bluebird';

export default async function handler(req, res) {
  // Allow all methods in development
  if (process.env.NODE_ENV === 'development' && 
    req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`) {
    // Continue with maintenance
  } else if (!req.headers['x-vercel-cron'] || 
            req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Starting maintenance tasks...');
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

    if (process.env.NODE_ENV === 'development') {
      console.log('Maintenance completed successfully');
    }

    res.status(200).json({ 
      message: 'Maintenance tasks completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Maintenance job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}