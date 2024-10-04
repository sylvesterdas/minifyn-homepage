import { useState } from 'react';
import SEO from '@/components/SEO';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import UrlShortener from '@/components/UrlShortener';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import UsageLimits from '@/components/UsageLimits';
import FeaturesSection from '@/components/FeaturesSection';
import { TRANSLATION_KEYS, FEATURE_KEYS } from '@/constants/text';
import PricingOverview from '@/components/PricingOverview';

export default function Home({ user }) {
  const [activeTab, setActiveTab] = useState('url');
  const { t } = useTranslation('common');

  return (
    <>
      <SEO />
      <div className="font-sans text-sm sm:text-base">
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

          <hr className="mx-10 shadow" />

          <PricingOverview />
        </main>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const resolvedLocale = locale || 'en';
  
  return {
    props: {
      ...(await serverSideTranslations(resolvedLocale, ['common', 'pricing'])),
    },
  };
}
