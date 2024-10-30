import Head from 'next/head';
import ApiKeyManager from '@/components/dashboard/ApiKeyManager';

export default function ApiKeys() {
  return (
    <>
      <Head>
        <title>API Keys | MiniFyn Dashboard</title>
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">API Keys</h1>
        </div>
        
        <ApiKeyManager />
      </div>
    </>
  );
}