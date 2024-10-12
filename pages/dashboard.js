import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useAuth } from '@/contexts/AuthContext';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RecentLinksList from '@/components/dashboard/RecentLinksList';
import UrlManagement from '@/components/dashboard/UrlManagement';
import AnalyticsOverview from '@/components/dashboard/AnalyticsOverview';
import SubscriptionDetails from '@/components/dashboard/SubscriptionDetails';
import Loading from '@/components/Loading';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { data: dashboardData, error, mutate } = useSWR('/api/dashboard', fetcher);
  const [showUrlManagement, setShowUrlManagement] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || !dashboardData) {
    return <Loading message="Loading dashboard data..." />;
  }

  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  const handleDeleteLink = async (shortCode) => {
    // Implement delete logic here
    await fetch(`/api/urls/${shortCode}`, { method: 'DELETE' });
    mutate();
  };

  const handleCreateNew = () => {
    setShowUrlManagement(true);
  };

  const isPro = dashboardData.activePlan === 'Pro';

  return (
    <>
      <Head>
        <title>Dashboard - MiniFyn</title>
      </Head>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome, {user?.fullName || user?.name}
      </h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <DashboardCard 
          title="Total Links"
          value={dashboardData.totalLinks}
          icon="🔗"
        />
        <DashboardCard 
          title="Total Clicks"
          value={dashboardData.totalClicks}
          icon="👆"
        />
        <DashboardCard 
          title="Active Plan"
          value={dashboardData.activePlan}
          icon="💼"
        />
      </div>

      {showUrlManagement && (
        <UrlManagement 
          isPro={isPro} 
          onUrlsChange={() => {
            mutate();
            setShowUrlManagement(false);
          }} 
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AnalyticsOverview data={dashboardData.analytics} isPro={isPro} />
        <SubscriptionDetails 
          currentPlan={dashboardData.activePlan}
          usage={dashboardData.usage}
          limits={dashboardData.limits}
        />
      </div>

      <RecentLinksList 
        links={dashboardData.recentLinks} 
        onDelete={handleDeleteLink}
        onCreateNew={handleCreateNew}
      />
    </>
  );
}