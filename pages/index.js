import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const shortenUrl = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: longUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError('An error occurred while shortening the URL');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Minifyn URL Shortener</title>
        <meta name="description" content="Shorten your long URLs with Minifyn" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-4xl font-bold mb-8">Minifyn URL Shortener</h1>
        <form onSubmit={shortenUrl} className="mb-8">
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter a long URL"
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Shorten URL
          </button>
        </form>
        {shortUrl && (
          <div className="bg-green-100 p-4 rounded">
            <p>Your shortened URL:</p>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {shortUrl}
            </a>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </main>
    </div>
  );
}