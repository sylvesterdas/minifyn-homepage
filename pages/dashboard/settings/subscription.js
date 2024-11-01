import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Loader2, RotateCw } from 'lucide-react';
import CurrentPlanStatus from '@/components/subscription/CurrentPlanStatus';
import SubscriptionUpgrade from '@/components/subscription/SubscriptionUpgrade';
import SubscriptionHistory from '@/components/subscription/SubscriptionHistory';

export default function Subscription() {
  const { user, setUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const res = await fetch('/api/dashboard/subscription-history');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpgradeSuccess = async (subscription) => {
    setUser(prev => ({
      ...prev,
      subscription: subscription
    }));
    window.location.reload();
  };

  const handleSyncSubscription = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/dashboard/sync-subscription', {
        method: 'POST'
      });
      const data = await res.json();
      
      if (data.success) {
        setUser(prev => ({
          ...prev,
          subscription: data.subscription
        }));
        await loadTransactions();
        window.location.reload();
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

        <CurrentPlanStatus subscription={user?.subscription} />

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Change Plan</h2>
            <p className="text-sm text-gray-500 mt-1">
              Upgrade or downgrade your subscription
            </p>
          </div>
          <div className="p-6">
            <SubscriptionUpgrade 
              user={user}
              currentPlan={user?.subscription?.type || 'free'}
              onSuccess={handleUpgradeSuccess}
            />
          </div>
        </div>

        <SubscriptionHistory transactions={transactions} />
      </div>
    </>
  );
}