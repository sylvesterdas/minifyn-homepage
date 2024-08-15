import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

const UrlShortener = ({ className = '' }) => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation('common');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (error) {
      setError(t('errorShortening'));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl).then(() => {
        alert(t('copiedToClipboard'));
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('enterLongUrl')}
          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-opacity-50 transition-colors"
          required
        />
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-secondary text-white rounded hover:bg-opacity-90 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? t('shortening') : t('shortenUrl')}
        </button>
      </form>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {shortUrl && (
        <div className="mt-4 p-2 bg-white bg-opacity-20 rounded flex justify-between items-center">
          <span className="text-white truncate flex-grow">
            {shortUrl}
          </span>
          <button
            onClick={copyToClipboard}
            className="ml-2 p-2 bg-secondary text-white rounded hover:bg-opacity-90 transition-colors"
            title={t('copyToClipboard')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;