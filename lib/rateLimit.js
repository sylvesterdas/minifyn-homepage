export function checkRateLimit(req) {
  const hourlyCount = parseInt(req.headers['x-rate-limit-hourly'] || '1', 10);
  const dailyCount = parseInt(req.headers['x-rate-limit-daily'] || '1', 10);
  return { hourlyCount, dailyCount };
}