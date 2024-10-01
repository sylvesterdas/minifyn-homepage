import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import AdConsent from './AdConsent';

const InvalidUrl = ({ scenario, t, adClientId, adSlotId, userCountry }) => {
  const [showAd, setShowAd] = useState(userCountry === 'LOCAL' || userCountry === 'UNKNOWN');

  let message;
  switch (scenario) {
    case 'notFound':
      message = t('urlNotFound');
      break;
    case 'expired':
      message = t('urlExpired');
      break;
    case 'error':
    default:
      message = t('errorOccurred');
  }

  useEffect(() => {
    if (showAd) {
      // Load Google Ads script
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.setAttribute('data-ad-client', adClientId);
      document.body.appendChild(script);

      // Initialize ads
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, [showAd, adClientId]);

  const handleAdConsent = (consent) => {
    setShowAd(consent);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {showAd && (
        <div className="w-full max-w-md mb-8">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client={adClientId}
               data-ad-slot={adSlotId}
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-red-500">{t('invalidUrl')}</h1>
        <p className="text-gray-700">{message}</p>
        <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
          {t('backToHome')}
        </Link>
      </div>
      <AdConsent onConsent={handleAdConsent} userCountry={userCountry} />
    </div>
  );
};

export default InvalidUrl;