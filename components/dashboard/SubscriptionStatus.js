import { useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';

const fetchWithRetry = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Failed to fetch subscription limits');
    error.status = res.status;
    error.info = await res.json();
    throw error;
  }
  return res.json();
};

const SubscriptionStatus = () => {
  const { data: limits, error, isValidating } = useSWR(
    '/api/dashboard/subscription-limits',
    fetchWithRetry,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute
      retryCount: 3,
      shouldRetryOnError: (error) => {
        // Only retry on network errors or 500s, not on 401s or 403s
        return !error.status || error.status >= 500;
      }
    }
  );

  const content = useMemo(() => {
    if (isValidating && !limits) {
      return (
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-20 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      );
    }

    if (error) {
      if (error.status === 401) {
        return (
          <div className="text-sm text-gray-500">
            Please log in again
          </div>
        );
      }
      return (
        <div className="text-sm text-gray-500">
          Unable to load usage info
        </div>
      );
    }

    return (
      <>
        <p className="text-sm font-medium text-gray-700 truncate capitalize">
          {limits?.planName || 'Free'} Plan
        </p>
        <p className="text-xs text-gray-500 truncate">
          {limits?.remainingLinks || 0} links remaining today
        </p>
      </>
    );
  }, [limits, error, isValidating]);

  return (
    <div className="flex items-center px-2 py-3 rounded-lg bg-gray-50">
      <div className="flex-1 min-w-0">
        {content}
      </div>
      <div className="flex-shrink-0">
        <Link 
          href="/dashboard/settings/subscription"
          className="text-xs font-medium text-secondary hover:text-blue-700"
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionStatus;