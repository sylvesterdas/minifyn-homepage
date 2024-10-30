import { kv } from '@vercel/kv';
import { sql } from '@vercel/postgres';

export async function getSystemMetrics() {
  try {
    // Try to get cached status first (5 minute cache)
    const cachedStatus = await kv.get('system:status');
    if (cachedStatus) {
      return cachedStatus;
    }

    // If no cache, perform real checks
    const startTime = Date.now();
    const [kvTest, dbTest] = await Promise.all([
      // KV check
      kv.set('test:ping', 'ping').then(() => true).catch(() => false),
      // DB check
      sql`SELECT 1`.then(() => true).catch(() => false)
    ]);
    const latency = Date.now() - startTime;

    const metrics = {
      timestamp: Date.now(),
      services: {
        'URL Shortening API': {
          status: kvTest ? 'operational' : 'down',
          lastChecked: new Date().toISOString()
        },
        'Database': {
          status: dbTest ? 'operational' : 'down',
          latency,
          lastChecked: new Date().toISOString()
        },
        'Link Redirection': {
          status: (kvTest && dbTest) ? 'operational' : 'degraded',
          lastChecked: new Date().toISOString()
        },
        'Analytics': {
          status: dbTest ? 'operational' : 'degraded',
          lastChecked: new Date().toISOString()
        }
      }
    };

    // Cache for 5 minutes
    await kv.set('system:status', metrics, { ex: 300 });
    return metrics;
  } catch (error) {
    console.error('Status Check Error:', error);
    return {
      timestamp: Date.now(),
      services: {
        'URL Shortening API': { status: 'unknown', lastChecked: new Date().toISOString() },
        'Database': { status: 'unknown', lastChecked: new Date().toISOString() },
        'Link Redirection': { status: 'unknown', lastChecked: new Date().toISOString() },
        'Analytics': { status: 'unknown', lastChecked: new Date().toISOString() }
      }
    };
  }
}