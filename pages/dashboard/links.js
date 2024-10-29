import Head from 'next/head';
import ComingSoon from '@/components/dashboard/ComingSoon';

export default function MyLinks() {
  return (
    <>
      <Head>
        <title>My Links | MiniFyn Dashboard</title>
      </Head>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Links</h1>
      
      <ComingSoon 
        title="Enhanced Link Management"
        description="A powerful interface to manage all your shortened URLs, track their performance, and organize them with tags is coming soon!"
      />
    </>
  );
}