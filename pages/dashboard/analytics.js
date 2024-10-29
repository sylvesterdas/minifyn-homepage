import Head from 'next/head';
import ComingSoon from '@/components/dashboard/ComingSoon';

export default function Analytics() {
  return (
    <>
      <Head>
        <title>Analytics | MiniFyn Dashboard</title>
      </Head>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analytics</h1>
      
      <ComingSoon 
        title="Advanced Analytics Dashboard"
        description="Detailed insights into your links' performance, including geographic data, device breakdowns, and custom reports are on the way!"
      />
    </>
  );
}