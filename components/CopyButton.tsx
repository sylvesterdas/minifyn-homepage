'use client';

import { useState } from 'react';

export function CopyButton({ text }: { text: string | string[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Convert to string if it's an array
    const textToCopy = Array.isArray(text) ? text.join('') : text;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 p-2 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-800"
      aria-label="Copy code"
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3H4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 7H20V20H8V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}
