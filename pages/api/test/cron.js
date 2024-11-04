export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not available in production' });
  }

  // Force all requests to be POST
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Use GET or POST method' });
  }

  const { job = 'all' } = req.query;
  const results = {};

  try {
    // Ensure we're using localhost for development
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000'
      : process.env.BASE_URL;

    console.log('Using base URL:', baseUrl);

    const commonHeaders = {
      'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      'x-vercel-cron': '1',
      'Content-Type': 'application/json'
    };

    const safeFetch = async (url, options) => {
      try {
        console.log(`Fetching ${url} with method ${options.method}`);
        const response = await fetch(url, options);
        const text = await response.text();
        
        console.log(`Response status:`, response.status);
        
        let data;
        try {
          data = text ? JSON.parse(text) : null;
        } catch (e) {
          console.error(`Invalid JSON response from ${url}:`, text);
          data = { error: 'Invalid JSON response', rawResponse: text };
        }

        return {
          status: response.status,
          data,
          headers: Object.fromEntries(response.headers.entries())
        };
      } catch (error) {
        console.error(`Failed to fetch ${url}:`, error);
        return {
          status: 500,
          data: { error: error.message },
          headers: {}
        };
      }
    };

    // Run maintenance job
    if (job === 'all' || job === 'maintenance') {
      console.log('Testing maintenance job...');
      results.maintenance = await safeFetch(
        `${baseUrl}/api/maintenance`,
        {
          method: 'POST',
          headers: commonHeaders
        }
      );
    }

    // Run subscription sync job
    if (job === 'all' || job === 'sync') {
      console.log('Testing subscription sync...');
      results.sync = await safeFetch(
        `${baseUrl}/api/cron/sync-subscriptions`,
        {
          method: 'POST',
          headers: commonHeaders
        }
      );
    }

    // Check for any failed jobs
    const failedJobs = Object.entries(results).filter(
      ([_, result]) => result.status >= 400
    );

    if (failedJobs.length > 0) {
      console.warn('Some jobs failed:', failedJobs);
      return res.status(207).json({
        success: false,
        message: 'Some jobs failed',
        results,
        failedJobs: failedJobs.map(([name]) => name),
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test cron error:', {
      message: error.message,
      stack: error.stack,
      results
    });
    
    return res.status(500).json({ 
      error: 'Test failed', 
      message: error.message,
      job,
      results,
      timestamp: new Date().toISOString()
    });
  }
}