import Head from 'next/head';
import ComingSoon from '@/components/dashboard/ComingSoon';

export default function ApiKeys() {
  return (
    <>
      <Head>
        <title>API Keys | MiniFyn Dashboard</title>
      </Head>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">API Keys</h1>
      
      <ComingSoon 
        title="API Key Management"
        description="Securely manage your API keys, monitor usage, and access detailed API documentation right from your dashboard."
      />
    </>
  );
}