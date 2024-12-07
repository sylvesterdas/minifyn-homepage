import React, { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

const ConsentManager = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Initialize analytics only after consent
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    
    // Listen for Osano consent changes
    window.addEventListener('osano-cm-consent-changed', (event) => {
      const { categories } = event.detail;
      
      if (categories.analytics) {
        gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted'
        });
        
        // Initialize GA4 with privacy-focused settings
        gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          page_path: router.pathname,
          anonymize_ip: true,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
          restricted_data_processing: true
        });
      } else {
        gtag('consent', 'update', {
          'analytics_storage': 'denied',
          'ad_storage': 'denied'
        });
      }
    });
  }, [router.pathname]);

  return (
    <>
      <Script
        id="ga-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Default to denied until consent is given
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied'
            });
            
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `
        }}
      />
    </>
  );
};

export default ConsentManager;