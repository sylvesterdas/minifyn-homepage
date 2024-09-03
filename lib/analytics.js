import db from './db';
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

const ANALYTICS_BUFFER_KEY = 'analytics:buffer';
const BUFFER_EXPIRY = 300; // 5 minutes

export async function incrementClicks(shortCode, req) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const referer = req.headers['referer'] || '';

  // Increment click count in KV store
  await kv.incr(`clicks:${shortCode}`);

  // Buffer analytics data in KV store
  const analyticsEntry = {
    id: uuidv4(),
    short_url_code: shortCode,
    ip_address: ip,
    user_agent: userAgent,
    referer: referer,
    timestamp: new Date().toISOString()
  };

  await kv.lpush(ANALYTICS_BUFFER_KEY, JSON.stringify(analyticsEntry));
  
  // Set expiry on the buffer key if it doesn't exist
  await kv.expire(ANALYTICS_BUFFER_KEY, BUFFER_EXPIRY);

  // Update last_accessed_at and clicks in short_urls table
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

export async function flushAnalyticsBuffer() {
  const bufferSize = await kv.llen(ANALYTICS_BUFFER_KEY);
  
  if (bufferSize === 0) {
    console.log('Analytics buffer is empty. Nothing to flush.');
    return;
  }

  const batchSize = 100; // Adjust based on your needs
  const batches = Math.ceil(bufferSize / batchSize);

  for (let i = 0; i < batches; i++) {
    const entries = await kv.lrange(ANALYTICS_BUFFER_KEY, i * batchSize, (i + 1) * batchSize - 1);
    const parsedEntries = entries.map(JSON.parse);

    // Batch insert into Postgres
    await db.query(db.sql`
      INSERT INTO analytics (
        id, short_url_code, ip_address, user_agent, referer, created_at
      )
      SELECT * FROM ${db.sql(parsedEntries.map(entry => [
        entry.id,
        entry.short_url_code,
        entry.ip_address,
        entry.user_agent,
        entry.referer,
        entry.timestamp
      ]))}
    `);
  }

  // Clear the buffer after successful insertion
  await kv.del(ANALYTICS_BUFFER_KEY);
  console.log(`Flushed ${bufferSize} analytics entries to Postgres.`);
}
