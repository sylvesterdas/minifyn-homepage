export const PLANS = {
  free: {
    id: 'free',
    name: 'Link Free',
    displayName: 'Free Plan',
    price: 0,
    features: [
      '10 URLs per day',
      '60-day validity',
      'Basic analytics',
      'API access',
      'Standard support'
    ],
    limits: {
      urls_per_day: 10,
      url_validity_days: 60,
      api_calls_per_month: 500,
      analytics_retention_days: 30
    },
    razorpay: {
      planId: null // free plan doesn't need Razorpay plan ID
    },
    details: {
      analytics: 'basic', // basic|advanced
      api_access: true,
      bulk_operations: false
    }
  },
  pro: {
    id: 'pro',
    name: 'Link Pro',
    displayName: 'Pro Plan',
    price: 99,
    features: [
      '50 URLs per day',
      '1-year validity',
      'Advanced analytics',
      'Full API access'
    ],
    limits: {
      urls_per_day: 50,
      url_validity_days: 365,
      api_calls_per_month: 10000,
      analytics_retention_days: 365
    },
    razorpay: {
      monthly: {
        planId: 'plan_PFBadEYZNEmHwI',
        currency: 'INR',
        interval: 'monthly'
      }
    },
    details: {
      analytics: 'advanced',
      api_access: true,
      custom_domain: true,
      bulk_operations: true,
      priority_support: true
    }
  }
};

// Helper functions for plan features
export const getPlanLimits = (planId) => {
  return PLANS[planId]?.limits || PLANS.free.limits;
};

export const getPlanFeatures = (planId) => {
  return PLANS[planId]?.details || PLANS.free.details;
};

export const isPlanFeatureEnabled = (planId, feature) => {
  const plan = PLANS[planId] || PLANS.free;
  return plan.details[feature] || false;
};

// Helper for getting Razorpay plan ID
export const getRazorpayPlanId = (planId, interval = 'monthly') => {
  const plan = PLANS[planId];
  if (!plan?.razorpay) return null;
  return plan.razorpay[interval]?.planId || null;
};