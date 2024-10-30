import { getSubscriptionLimits } from './subscriptionService';

export function validateUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function validateBatchRequest(urls, subscriptionType) {
  if (!Array.isArray(urls)) return 'Invalid request format';
  
  const limits = await getSubscriptionLimits(subscriptionType);
  if (urls.length > limits.batchSize) return `Batch size exceeds limit of ${limits.batchSize}`;
  if (!urls.every(u => u?.url && validateUrl(u.url))) return 'Invalid URLs in batch';
  
  return null;
}