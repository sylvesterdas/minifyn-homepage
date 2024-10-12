import Link from 'next/link';

export default function SubscriptionDetails({ currentPlan, usage, limits }) {
  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription Details</h2>
      <p className="text-sm text-gray-600 mb-4">
        Current Plan: {currentPlan}
      </p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900">URLs Created</h3>
          <p className="mt-1 text-sm text-gray-600">{usage.urlsCreated} / {limits.maxUrls}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">API Calls</h3>
          <p className="mt-1 text-sm text-gray-600">{usage.apiCalls} / {limits.maxApiCalls}</p>
        </div>
      </div>
      {currentPlan === 'Free' && (
        <Link href="/pricing" className="text-secondary hover:underline">
          Upgrade to Pro
        </Link>
      )}
    </div>
  );
}