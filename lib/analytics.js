import db from './db';
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';
import { incrementUrlClicks } from './cache';

const ANALYTICS_BUFFER_KEY = 'analytics:buffer';
const ANALYTICS_BATCH_KEY = 'analytics:batch:';
const BUFFER_EXPIRY = 300; // 5 minutes
const BATCH_SIZE = 100;

export async function incrementClicks(shortCode, req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';
  const referer = req.headers['referer'] || '';

  // Create analytics entry
  const analyticsEntry = {
    id: uuidv4(),
    short_url_code: shortCode,
    ip_address: ip,
    user_agent: userAgent,
    referer: referer,
    timestamp: new Date().toISOString()
  };

  try {
    // Pipeline our KV operations
    const pipeline = kv.pipeline()
      .lpush(ANALYTICS_BUFFER_KEY, JSON.stringify(analyticsEntry))
      .expire(ANALYTICS_BUFFER_KEY, BUFFER_EXPIRY);

    // Use the new incrementUrlClicks function from cache.js
    const [bufferResult, clickCount] = await Promise.all([
      pipeline.exec(),
      incrementUrlClicks(shortCode)
    ]);

    // If buffer is getting large, trigger a background flush
    const bufferLength = bufferResult[0];
    if (bufferLength >= BATCH_SIZE) {
      // Use edge runtime to flush in background
      fetch('/api/analytics-flush', { method: 'POST' })
        .catch(err => console.error('Background flush failed:', err));
    }

    return clickCount;
  } catch (error) {
    console.error('Error recording analytics:', error);
    // Store failed analytics in a separate backup buffer
    await kv.lpush('analytics:failed', JSON.stringify({
      ...analyticsEntry,
      error: error.message
    }));
  }
}

export async function flushAnalyticsBuffer() {
  const bufferLength = await kv.llen(ANALYTICS_BUFFER_KEY);
  
  if (bufferLength === 0) {
    return { flushed: 0 };
  }

  const batchCount = Math.ceil(bufferLength / BATCH_SIZE);
  const batchId = uuidv4();
  let totalFlushed = 0;

  try {
    // Process in smaller batches
    for (let i = 0; i < batchCount; i++) {
      const entries = await kv.lrange(ANALYTICS_BUFFER_KEY, i * BATCH_SIZE, (i + 1) * BATCH_SIZE - 1);
      if (!entries.length) continue;

      const parsedEntries = entries.map(JSON.parse);
      
      // Store batch temporarily with expiration
      await kv.set(
        `${ANALYTICS_BATCH_KEY}${batchId}:${i}`, 
        JSON.stringify(parsedEntries), 
        { ex: 600 } // 10 minutes expiration
      );

      // Batch insert into Postgres with error handling
      try {
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
          ON CONFLICT (id) DO NOTHING
        `);

        totalFlushed += parsedEntries.length;
        
        // Remove successful batch
        await kv.del(`${ANALYTICS_BATCH_KEY}${batchId}:${i}`);
      } catch (error) {
        console.error(`Error flushing batch ${i}:`, error);
        // Leave the batch in KV store for retry
        throw error;
      }
    }

    // Only trim the buffer if we've successfully processed everything
    if (totalFlushed > 0) {
      await kv.ltrim(ANALYTICS_BUFFER_KEY, totalFlushed, -1);
    }

    return { flushed: totalFlushed };
  } catch (error) {
    // If there's an error, we can retry failed batches later
    console.error('Error during analytics flush:', error);
    return { 
      error: 'Partial flush failure', 
      flushed: totalFlushed,
      batchId 
    };
  }
}

export async function retryFailedAnalytics() {
  const failedEntries = await kv.lrange('analytics:failed', 0, -1);
  if (!failedEntries.length) return { retried: 0 };

  let successCount = 0;
  
  for (const entry of failedEntries) {
    try {
      const parsedEntry = JSON.parse(entry);
      delete parsedEntry.error; // Remove error field before inserting

      await db.query(db.sql`
        INSERT INTO analytics (
          id, short_url_code, ip_address, user_agent, referer, created_at
        ) VALUES (
          ${parsedEntry.id},
          ${parsedEntry.short_url_code},
          ${parsedEntry.ip_address},
          ${parsedEntry.user_agent},
          ${parsedEntry.referer},
          ${parsedEntry.timestamp}
        )
        ON CONFLICT (id) DO NOTHING
      `);
      
      successCount++;
    } catch (error) {
      console.error('Error retrying analytics entry:', error);
    }
  }

  // Remove successful entries
  if (successCount > 0) {
    await kv.ltrim('analytics:failed', successCount, -1);
  }

  return { retried: successCount };
}