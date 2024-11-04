import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Loader2, RotateCw, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import useSWR from 'swr';
import CurrentPlanStatus from '@/components/subscription/CurrentPlanStatus';
import SubscriptionUpgrade from '@/components/subscription/SubscriptionUpgrade';
import SubscriptionHistory from '@/components/subscription/SubscriptionHistory';

const fetcher = url => fetch(url).then(r => r.json());

export default function Subscription() {
  const router = useRouter();
  const { upgrade, fromSignup, paymentFailed } = router.query;
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch subscription details
  const { data: subscriptionData, error: subError, mutate: mutateSubscription } = 
    useSWR('/api/dashboard/subscription-details', fetcher);

  // Fetch transaction history
  const { data: historyData, error: historyError, mutate: mutateHistory } = 
    useSWR('/api/dashboard/subscription-history', fetcher);

  useEffect(() => {
    if (subscriptionData || subError) {
      setIsLoading(false);
    }
  }, [subscriptionData, subError]);

  // Clean up query params after showing relevant messages
  useEffect(() => {
    if (upgrade || fromSignup || paymentFailed) {
      const timer = setTimeout(() => {
        router.replace('/dashboard/settings/subscription', undefined, { shallow: true });
      }, 5000); // Clear params after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [upgrade, fromSignup, paymentFailed, router]);

  const handleUpgradeSuccess = async (subscription) => {
    await Promise.all([
      mutateSubscription(),
      mutateHistory()
    ]);
    
    setUser(prev => ({
      ...prev,
      subscription: subscription
    }));

    // Show success message and redirect to dashboard
    router.push('/dashboard');
  };

  const handleSyncSubscription = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/dashboard/sync-subscription', {
        method: 'POST'
      });
      const data = await res.json();
      
      if (data.success) {
        await Promise.all([
          mutateSubscription(),
          mutateHistory()
        ]);
        setUser(prev => ({
          ...prev,
          subscription: data.subscription
        }));
      } else {
        alert(data.message || 'No active subscription found');
      }
    } catch (error) {
      console.error('Failed to sync subscription:', error);
      alert('Failed to sync subscription. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusBanner = () => {
    if (paymentFailed) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-red-900">Payment Failed</h3>
            <p className="text-sm text-red-700">
              Your payment was unsuccessful. You can try upgrading again when you&apos;re ready. 
              Your account is currently on the free plan.
            </p>
          </div>
        </div>
      );
    }

    if (fromSignup && upgrade) {
      return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-blue-900">Complete Your Pro Subscription</h3>
            <p className="text-sm text-blue-700">
              Your account has been created successfully. Complete your Pro subscription setup below 
              to access all premium features.
            </p>
          </div>
        </div>
      );
    }

    if (!fromSignup && upgrade) {
      return (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-green-900">Ready to Upgrade</h3>
            <p className="text-sm text-green-700">
              Upgrade to Pro to unlock all premium features and increase your usage limits.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Subscription | MiniFyn Dashboard</title>
        </Head>

        <div className="space-y-6 animate-pulse">
          <h1 className="text-2xl font-semibold text-gray-900">Subscription Management</h1>
          <div className="h-[200px] bg-gray-200 rounded-lg"></div>
          <div className="h-[400px] bg-gray-200 rounded-lg"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Subscription | MiniFyn Dashboard</title>
      </Head>

      <div className="space-y-6">
        {getStatusBanner()}

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Subscription Management</h1>
          
          <button
            onClick={handleSyncSubscription}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4" />
            )}
            {isSyncing ? 'Syncing...' : 'Sync Subscription'}
          </button>
        </div>

        <CurrentPlanStatus subscription={subscriptionData?.subscription} />

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Change Plan</h2>
            <p className="text-sm text-gray-500 mt-1">
              {fromSignup 
                ? 'Complete your subscription setup to access premium features'
                : 'Upgrade or manage your subscription plan'
              }
            </p>
          </div>
          <div className="p-6">
            <SubscriptionUpgrade 
              user={user}
              currentPlan={user?.subscriptionType || 'free'}
              onSuccess={handleUpgradeSuccess}
              subscriptionId={subscriptionData?.subscription?.subscription_id}
              isFromSignup={Boolean(fromSignup)}
            />
          </div>
        </div>

        <SubscriptionHistory transactions={historyData?.transactions || []} />
      </div>
    </>
  );
}