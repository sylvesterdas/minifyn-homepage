export const SUBSCRIPTION_LIMITS = {
  anonymous: {
    dailyUrls: 2,
    batchSize: 1,
    expiryDays: 30,
    apiCalls: 0
  },
  free: {
    dailyUrls: 10,
    batchSize: 10,
    expiryDays: 60,
    apiCalls: 500
  },
  pro: {
    dailyUrls: 50,
    batchSize: 50,
    expiryDays: 365,
    apiCalls: 10000
  }
};

export const SUBSCRIPTION_FEATURES = {
  anonymous: ['basic_shortening'],
  free: ['basic_shortening', 'api_access', 'basic_analytics'],
  pro: ['basic_shortening', 'api_access', 'detailed_analytics', 'custom_alias', 'bulk_operations']
};