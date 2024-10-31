import db from '@/lib/db';
import { cleanupSessions } from '@/lib/auth';
import { flushAnalyticsBuffer } from '@/lib/analytics';
import Promise from 'bluebird';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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