'use client';

import { useState } from 'react';
import { Clipboard } from 'lucide-react';

export function URLShortener() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // API implementation will go here
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative group">
        <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-1000" />
        <div className="relative flex items-center bg-slate-800/50 rounded-lg border border-slate-700/50">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL"
            className="w-full px-4 py-3 bg-transparent border-none text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-0"
            required
          />
          <button
            type="button"
            className="px-4 text-slate-400 hover:text-white transition-colors"
            onClick={() => navigator.clipboard.readText().then(setUrl)}
          >
            <Clipboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium 
          transition-all hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50"
      >
        Create Short URL
      </button>
    </form>
  );
}