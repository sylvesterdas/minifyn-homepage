export const emailConfig = {
  service: 'zoho',
  maxRetries: 3,
  retryDelay: 1000,
  limits: {
    verificationTTL: 24 * 60 * 60, // 24 hours
    resetTokenTTL: 30 * 60, // 30 minutes
    maxDailyEmails: 50 // Keep low for free tier
  }
};
