import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const UsageLimits = ({  }) => {
  const { user } = useAuth()
  const userType = user?.subscriptionType;
  const limits = {
    anonymous: {
      links: 2,
      validity: '24 hours',
      analytics: 'NA'
    },
    free: {
      links: 10,
      validity: '60 days',
      analytics: 'Basic',
    },
    pro: {
      links: 50,
      validity: '1 year',
      analytics: 'Full',
    },
  };

  const currentLimits = limits[userType] ?? limits.anonymous;

  return (
    <div className="mt-4 p-4 bg-white bg-opacity-10 rounded-lg text-white text-sm">
      <h3 className="font-semibold mb-2">Current Usage Limits:</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>Links per day: {currentLimits.links}</li>
        <li>Link validity: {currentLimits.validity}</li>
        {currentLimits.analytics && <li>Analytics: {currentLimits.analytics}</li>}
      </ul>
      {userType === 'anonymous' && (
        <p className="mt-2 text-xs">
          <Link href="/signup" className="text-coral hover:underline font-medium">Sign up</Link> for a free account to increase your limits and access more features!
        </p>
      )}
      {userType === 'free' && (
        <p className="mt-2 text-xs">
          Upgrade to Pro for unlimited links and advanced analytics!
        </p>
      )}
    </div>
  );
};

export default UsageLimits;