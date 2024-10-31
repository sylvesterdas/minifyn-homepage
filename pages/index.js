import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '@/components/SEO';
import { Hero } from '@/components/landing/Hero';
import { useAuth } from '@/contexts/AuthContext';
import { TRANSLATION_KEYS, FEATURE_KEYS } from '@/constants/text';

import FeaturesSection from '@/components/FeaturesSection';
import PricingOverview from '@/components/PricingOverview';
import PopularLinks from '@/components/PopularLinks';

export default function Home() {
  const [activeTab, setActiveTab] = useState('url');
  const { t } = useTranslation('common');
  const { user } = useAuth();

  const features = FEATURE_KEYS.map(key => ({
    title: t(`${TRANSLATION_KEYS.FEATURES[key]}.title`),
    description: t(`${TRANSLATION_KEYS.FEATURES[key]}.description`),
  }));

  return (
    <>
      <SEO />
      <div className="font-sans antialiased text-sm sm:text-base">
        <main className="space-y-16 min-h-screen">
          <div className="transform-gpu">
            <Hero 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userType={user?.subscriptionType ?? 'anonymous'}
            />
          </div>

          <div id="features" className="scroll-mt-16 transform-gpu">
            <FeaturesSection features={features} />
          </div>

          <div id="popular" className="scroll-mt-16 transform-gpu">
            <PopularLinks />
          </div>

          <div id="pricing" className="scroll-mt-16 transform-gpu">
            <PricingOverview />
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps({ locale, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=59'
  );
  
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'pricing'])),
    },
  };
}