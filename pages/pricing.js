import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Check, Clock } from 'lucide-react';
import SEO from '@/components/SEO';

const PricingCard = ({ title, features, ctaText, ctaLink }) => (
  <Card className="h-max transition-all duration-300 hover:shadow-lg">
    <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
      <h3 className="text-2xl font-bold text-center text-gray-800">{title}</h3>
      <p className="text-4xl font-bold text-center mt-2 text-blue-600">Free</p>
    </CardHeader>
    <CardContent className="pt-6">
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Link 
        href={ctaLink} 
        className="block w-full text-center py-3 px-4 rounded-lg font-semibold bg-blue-600 text-white hover:opacity-90 transition-opacity"
      >
        {ctaText}
      </Link>
    </CardContent>
  </Card>
);

const ComingSoonCard = ({ title, features }) => (
  <Card className="h-max bg-gray-50 border-dashed">
    <CardHeader>
      <div className="flex items-center justify-center gap-2">
        <Clock className="w-6 h-6 text-blue-600" />
        <h3 className="text-2xl font-bold text-center text-gray-800">{title}</h3>
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <p className="text-gray-600 text-center mb-4">Stay tuned for our Pro plan featuring:</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default function PricingPage() {
  const { t } = useTranslation('common');

  const freePlan = {
    title: t('pricing.freePlan.title'),
    features: [
      t('pricing.freePlan.feature1'),
      t('pricing.freePlan.feature2'),
      t('pricing.freePlan.feature3'),
      t('pricing.freePlan.feature4'),
      t('pricing.freePlan.feature5'),
    ],
    ctaText: t('pricing.freePlan.cta'),
    ctaLink: '/signup',
  };

  const comingSoonFeatures = [
    t('pricing.proPlan.feature1'),
    t('pricing.proPlan.feature2'),
    t('pricing.proPlan.feature3'),
    t('pricing.proPlan.feature4'),
    t('pricing.proPlan.feature5'),
    t('pricing.proPlan.feature6'),
  ];

  return (
    <div className="max-h-screen">
      <SEO
        title="Pricing - MiniFyn"
        description="Pricing for different subscriptions in MiniFyn."
        canonical="https://www.minifyn.com/features"
        keywords={['URL shortening', 'web analytics', 'feature', 'comparison']}
      />
      <div className="container mx-auto px-4 py-16 max-w-screen-xl">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
          {t('pricing.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 text-center">
          {t('pricing.subtitle')}
        </p>
        
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 mb-12">
          <div className="w-full max-w-md">
            <PricingCard {...freePlan} />
          </div>
          <div className="w-full max-w-md">
            <ComingSoonCard 
              title="Pro Plan Coming Soon"
              features={comingSoonFeatures}
            />
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/features" className="text-blue-600 hover:underline font-medium">
            {t('pricing.compareFeatures')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}