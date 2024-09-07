import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { getToken } from '@/lib/authUtils';
import Loading from '../components/Loading';

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="text-secondary text-2xl">{icon}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const { t } = useTranslation('dashboard');
  const { user, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDashboardData();
    }
  }, [authLoading]);

  if (authLoading || loading) {
    return <Loading message="Loading dashboard data..." />;
  }

  if (!user) {
    setTimeout(() => router.replace('/login'), 1000)
    return <div className="min-h-screen">Please log in to view your dashboard.</div>;
  }

  return (
    <>
      <Head>
        <title>{t('dashboard.title')}</title>
      </Head>

      <div className="py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('dashboard.welcome', { name: user.fullName })}</h1>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard 
            title={t('dashboard.totalLinks')} 
            value={dashboardData?.totalLinks || 0} 
            icon="🔗" 
          />
          <DashboardCard 
            title={t('dashboard.totalClicks')} 
            value={dashboardData?.totalClicks || 0} 
            icon="👆" 
          />
          <DashboardCard 
            title={t('dashboard.activePlan')} 
            value={dashboardData?.activePlan || 'Free'} 
            icon="💼" 
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('dashboard.recentLinks')}</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {dashboardData?.recentLinks?.map((link) => (
                <li key={link.short_url}>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Link href={link.shortUrl} target='_blank' className="text-sm font-medium text-secondary truncate">{link.shortUrl}</Link>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {link.clicks} {t('dashboard.clicks')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {link.original_url}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            {t('dashboard.created')}: {new Date(link.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['dashboard', 'common'])),
    },
  };
};

export default Dashboard;