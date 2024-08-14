import React, { useState } from 'react';

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const ClearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const UrlShortener = ({ className = '' }) => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement actual URL shortening logic
    // For now, we'll just simulate it
    setShortUrl(`https://mnfy.in/${Math.random().toString(36).substr(2, 6)}`);
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl).then(() => {
        alert('Copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  };

  const clearAll = () => {
    setUrl('');
    setShortUrl('');
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL"
            className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-opacity-50 transition-colors pr-10"
            required
          />
          <button
            type="button"
            onClick={clearAll}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100 focus:outline-none"
            title="Clear"
          >
            <ClearIcon />
          </button>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-secondary text-white rounded hover:bg-opacity-90 transition-colors"
        >
          Shorten URL
        </button>
      </form>
      <div className="mt-4 p-2 bg-white bg-opacity-20 rounded flex justify-between items-center">
        <span className="text-white truncate flex-grow">
          {shortUrl || 'Your shortened URL will appear here'}
        </span>
        <button
          onClick={copyToClipboard}
          className={`ml-2 p-2 rounded transition-colors ${
            shortUrl 
              ? 'bg-secondary text-white hover:bg-opacity-90' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
          disabled={!shortUrl}
          title="Copy to clipboard"
        >
          <ClipboardIcon />
        </button>
      </div>
    </div>
  );
};

export default UrlShortener;