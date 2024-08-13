import Head from 'next/head';

export default function InvalidUrl() {
  return (
    <>
      <Head>
        <title>Invalid URL - Minifyn</title>
        <meta httpEquiv="refresh" content="5;url=https://www.minifyn.com/" />
      </Head>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Invalid URL</h1>
          <p className="text-xl">This URL does not exist or has expired.</p>
          <p className="mt-4">Redirecting to homepage in 5 seconds...</p>
        </div>
      </div>
    </>
  );
}