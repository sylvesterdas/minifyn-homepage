'use client';

import { ReactNode, useState, useRef } from 'react';

export function CodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null) as any;

  const handleCopy = async () => {
    const code = codeRef.current?.textContent || '';

    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        aria-label="Copy code"
        className="absolute right-2 top-2 p-2 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-800"
        onClick={handleCopy}
      >
        {copied ? (
          <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </svg>
        ) : (
          <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3H4V16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            <path d="M8 7H20V20H8V7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </svg>
        )}
      </button>
      <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto my-4">
        <code ref={codeRef} className="text-sm font-mono text-slate-200">{children}</code>
      </pre>
    </div>
  );
}
