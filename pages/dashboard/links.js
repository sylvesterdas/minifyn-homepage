import Head from 'next/head';
import LinkManager from '@/components/dashboard/LinkManager';

export default function MyLinks() {
  return (
    <>
      <Head>
        <title>My Links | MiniFyn Dashboard</title>
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">My Links</h1>
        </div>
        
        <LinkManager />
      </div>
    </>
  );
}