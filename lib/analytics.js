import db from './db';
import { kv } from '@vercel/kv';

export async function incrementClicks(shortCode, req) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const referer = req.headers['referer'] || '';

  // Increment click count in KV store
  await kv.incr(`clicks:${shortCode}`);

  // Log analytics data to database
  await db.query(db.sql`
    INSERT INTO analytics (short_url_code, ip_address, user_agent, referer)
    VALUES (${shortCode}, ${ip}, ${userAgent}, ${referer})
  `);

  // Update last_accessed_at in short_urls table
  await db.query(db.sql`
    UPDATE short_urls
    SET last_accessed_at = NOW(), clicks = clicks + 1
    WHERE short_code = ${shortCode}
  `);
}

export async function getClickCount(shortCode) {
  // Get click count from KV store
  const clicks = await kv.get(`clicks:${shortCode}`);
  if (clicks !== null) {
    return clicks;
  }

  // If not in KV store, get from database and update KV
  const result = await db.query(db.sql`
    SELECT clicks FROM short_urls WHERE short_code = ${shortCode}
  `);

  if (result.rows.length > 0) {
    const dbClicks = result.rows[0].clicks;
    await kv.set(`clicks:${shortCode}`, dbClicks);
    return dbClicks;
  }

  return 0;
}