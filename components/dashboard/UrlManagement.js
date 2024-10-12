import { useState, useRef, useEffect } from 'react';

export default function UrlManagement({ isPro, onUrlsChange }) {
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Execute reCAPTCHA
      const recaptchaToken = await new Promise((resolve) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' }).then(resolve);
        });
      });

      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl, recaptchaToken }),
      });

      if (res.ok) {
        setNewUrl('');
        onUrlsChange();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create link');
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">URL Management</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Enter URL to shorten"
            required
            className="flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-md"
          />
          <button 
            type="submit" 
            className="bg-secondary text-white px-4 py-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isPro && (
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">Pro Features</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Custom alias</li>
            <li>Bulk URL shortening</li>
            <li>QR code generation</li>
          </ul>
        </div>
      )}
    </div>
  );
}