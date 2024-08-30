import React, { useEffect, useState } from 'react';

const AdRedirect = ({ originalUrl, isAnonymous, redirectDelay, clicks, t }) => {
  const [secondsLeft, setSecondsLeft] = useState(redirectDelay);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timerId = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      window.location.href = originalUrl;
    }
  }, [secondsLeft, originalUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">{t('redirecting')}</h1>
        <p className="mb-4">
          {t('redirectCountdown', { seconds: secondsLeft })}
        </p>
        {isAnonymous && (
          <div className="mb-4">
            <p>{t('anonymousAdMessage')}</p>
            {/* Add your ad component here */}
          </div>
        )}
        <p className="text-sm text-gray-500">
          {t('clickCount', { count: clicks })}
        </p>
        <a
          href={originalUrl}
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          {t('clickHereIfNotRedirected')}
        </a>
      </div>
    </div>
  );
};

export default AdRedirect;