import Head from 'next/head';
import ComingSoon from '@/components/dashboard/ComingSoon';

export default function Subscription() {
  return (
    <>
      <Head>
        <title>Subscription | MiniFyn Dashboard</title>
      </Head>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Subscription</h1>
      
      <ComingSoon 
        title="Subscription Management"
        description="Manage your subscription, view billing history, and upgrade your plan with our seamless subscription management interface."
      />
    </>
  );
}