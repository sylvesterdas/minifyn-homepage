import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useInView } from '@/hooks/useInView';
import SEO from '@/components/SEO';
import { Hero } from '@/components/landing/Hero';
import { useAuth } from '@/contexts/AuthContext';
import { TRANSLATION_KEYS, FEATURE_KEYS } from '@/constants/text';

// Loading placeholders as separate components for better reuse
const SectionPlaceholder = ({ height = "h-96" }) => (
  <div className={`${height} animate-pulse bg-gray-100 rounded-lg`} />
);

// Dynamically import components with better loading states
const FeaturesSection = dynamic(() => import('@/components/FeaturesSection'), {
  ssr: false,
  loading: () => <SectionPlaceholder />
});

const PricingOverview = dynamic(() => import('@/components/PricingOverview'), {
  ssr: false,
  loading: () => <SectionPlaceholder />
});

const PopularLinks = dynamic(() => import('@/components/PopularLinks'), {
  ssr: false,
  loading: () => <SectionPlaceholder height="h-72" />
});

export default function Home() {
  const [activeTab, setActiveTab] = useState('url');
  const { t } = useTranslation('common');
  const { user } = useAuth();

  // Refs for intersection observer
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const popularRef = useRef(null);

  // Check if sections are in view
  const isFeaturesInView = useInView(featuresRef);
  const isPricingInView = useInView(pricingRef);
  const isPopularInView = useInView(popularRef);

  const features = FEATURE_KEYS.map(key => ({
    title: t(`${TRANSLATION_KEYS.FEATURES[key]}.title`),
    description: t(`${TRANSLATION_KEYS.FEATURES[key]}.description`),
  }));

  return (
    <>
      <SEO />
      <div className="font-sans text-sm sm:text-base">
        <main className="space-y-16">
          <Hero 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userType={user?.subscriptionType ?? 'anonymous'}
          />

          <section ref={featuresRef} className="scroll-mt-16" id="features">
            {isFeaturesInView && <FeaturesSection features={features} />}
          </section>

          <section ref={popularRef} className="scroll-mt-16" id="popular">
            {isPopularInView && <PopularLinks />}
          </section>

          <section ref={pricingRef} className="scroll-mt-16" id="pricing">
            {isPricingInView && <PricingOverview />}
          </section>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps({ locale, res }) {
  // Set caching headers
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