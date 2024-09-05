import { useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import UrlShortener from '../components/UrlShortener';
import QRCodeGenerator from '../components/QRCodeGenerator';
import UsageLimits from '../components/UsageLimits';
import FeaturesSection from '../components/FeaturesSection';
import { TRANSLATION_KEYS, FEATURE_KEYS } from '../constants/text';
import StructuredData from '../components/StructuredData';

export default function Home({ user }) {
  const [activeTab, setActiveTab] = useState('url');
  const { t } = useTranslation('common');

  const pageTitle = `MiniFyn - ${t(TRANSLATION_KEYS.BANNER_TITLE)}`;
  const pageDescription = t(TRANSLATION_KEYS.BANNER_SUBTITLE);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MiniFyn",
    "url": "https://www.minifyn.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.minifyn.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="font-sans text-sm sm:text-base">
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="canonical" href="https://www.minifyn.com" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.minifyn.com" />
          <meta property="og:image" content="https://www.minifyn.com/og-image.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:image" content="https://www.minifyn.com/twitter-image.jpg" />
        </Head>

        <main>
          <div className="bg-gradient-to-br from-primary via-secondary to-teal relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 relative z-10">
              <div className="md:flex md:items-center md:justify-between">
                <div className="text-center md:text-left md:w-1/2 mb-6 md:mb-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">{t(TRANSLATION_KEYS.BANNER_TITLE)}</h1>
                  <p className="text-base sm:text-lg md:text-xl mb-4 text-light-gray">{t(TRANSLATION_KEYS.BANNER_SUBTITLE)}</p>
                </div>
                <div className="md:w-1/2 md:max-w-md mx-auto">
                  <div className="bg-white bg-opacity-10 rounded-lg shadow-lg backdrop-blur-sm overflow-hidden">
                    <div className="flex border-b border-white border-opacity-20">
                      <button
                        className={`flex-1 py-2 px-3 text-sm sm:text-base focus:outline-none ${activeTab === 'url' ? 'bg-white bg-opacity-20' : ''}`}
                        onClick={() => setActiveTab('url')}
                      >
                        {t('urlShortener')}
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 text-sm sm:text-base focus:outline-none ${activeTab === 'qr' ? 'bg-white bg-opacity-20' : ''}`}
                        onClick={() => setActiveTab('qr')}
                      >
                        {t('qrCode')}
                      </button>
                    </div>
                    <div className="p-4 sm:p-6 h-96 overflow-y-auto">
                      {activeTab === 'url' ? (
                        <>
                          <UrlShortener />
                          <UsageLimits userType={user ? (user.accountType ?? 'free') : 'anonymous'} />
                        </>
                      ) : (
                        <QRCodeGenerator />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FeaturesSection features={FEATURE_KEYS.map(key => ({
            title: t(`${TRANSLATION_KEYS.FEATURES[key]}.title`),
            description: t(`${TRANSLATION_KEYS.FEATURES[key]}.description`),
          }))} />
        </main>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const resolvedLocale = locale || 'en';
  
  return {
    props: {
      ...(await serverSideTranslations(resolvedLocale, ['common'])),
    },
  };
}