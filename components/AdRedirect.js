import Head from 'next/head';

export default function AdRedirect({ originalUrl, isAnonymous, redirectDelay }) {
  return (
    <>
      <Head>
        <title>Redirecting - Minifyn</title>
        <meta httpEquiv="refresh" content={`${redirectDelay};url=${originalUrl}`} />
      </Head>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-3">
            <a href="https://www.minifyn.com/" target="_blank" rel="noopener noreferrer">
              <img src="/favicon.ico" alt="Minifyn Logo" className="h-8" />
            </a>
          </div>
        </nav>
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-4">Redirecting...</h1>
          {isAnonymous && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Advertisement</h2>
              {/* Add your ad banner here */}
              <div className="bg-gray-200 h-60 flex items-center justify-center">
                <p className="text-gray-600">Ad Banner Placeholder</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}