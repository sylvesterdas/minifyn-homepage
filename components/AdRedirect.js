import React, { useEffect, useState } from 'react';
import AdConsent from './AdConsent';

const AdRedirect = ({ originalUrl, isAnonymous, redirectDelay, clicks, title, description, adClientId, adSlotId, userCountry, t }) => {
  const [secondsLeft, setSecondsLeft] = useState(redirectDelay);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timerId = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      window.location.href = originalUrl;
    }
  }, [secondsLeft, originalUrl]);

  useEffect(() => {
    if (showAd && isAnonymous) {
      // Load Google Ads script
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.setAttribute('data-ad-client', adClientId);
      document.body.appendChild(script);

      // Initialize ads
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, [showAd, isAnonymous, adClientId]);

  const handleAdConsent = (consent) => {
    setShowAd(consent);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">{t('redirecting')}</h1>
        <p className="mb-4">
          {t('redirectCountdown', { seconds: secondsLeft })}
        </p>
        {isAnonymous && showAd && (
          <div className="mb-4">
            <p>{t('anonymousAdMessage')}</p>
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client={adClientId}
                 data-ad-slot={adSlotId}
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
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
      {isAnonymous && <AdConsent onConsent={handleAdConsent} userCountry={userCountry} />}
    </div>
  );
};

export default AdRedirect;