import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

const PricingCard = ({ title, price, description, features, ctaText, ctaLink, isPro }) => (
  <Card className={`h-max ${isPro ? 'border-2 border-blue-500 shadow-xl z-10 lg:-mt-4 lg:-mb-4' : 'lg:mr-4'} transition-all duration-300 hover:shadow-2xl`}>
    <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
      <h3 className="text-2xl font-bold text-center text-gray-800">{title}</h3>
      <p className="text-4xl font-bold text-center mt-2 text-blue-600">
        {price === 0 ? 'Free' : `₹${price}/month`}
      </p>
      <p className="text-center text-gray-600 mt-2">{description}</p>
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
      <Link href={ctaLink} className={`block w-full text-center py-3 px-4 rounded-lg font-semibold ${isPro ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} hover:opacity-90 transition-opacity`}>
        {ctaText}
      </Link>
    </CardContent>
  </Card>
);

export default function PricingPage() {
  const { t } = useTranslation('common');

  const plans = [
    {
      title: t('pricing.freePlan.title'),
      price: 0,
      description: t('pricing.freePlan.description'),
      features: [
        t('pricing.freePlan.feature1'),
        t('pricing.freePlan.feature2'),
        t('pricing.freePlan.feature3'),
        t('pricing.freePlan.feature4'),
        t('pricing.freePlan.feature5'),
      ],
      ctaText: t('pricing.freePlan.cta'),
      ctaLink: '/signup',
      isPro: false,
    },
    {
      title: t('pricing.proPlan.title'),
      price: 99,
      description: t('pricing.proPlan.description'),
      features: [
        t('pricing.proPlan.feature1'),
        t('pricing.proPlan.feature2'),
        t('pricing.proPlan.feature3'),
        t('pricing.proPlan.feature4'),
        t('pricing.proPlan.feature5'),
        t('pricing.proPlan.feature6'),
      ],
      ctaText: t('pricing.proPlan.cta'),
      ctaLink: '/signup?plan=pro',
      isPro: true,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-screen-xl">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">{t('pricing.title')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 text-center">{t('pricing.subtitle')}</p>
        
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 mb-12">
          {plans.map((plan, index) => (
            <div key={index} className="w-full max-w-md">
              <PricingCard {...plan} />
            </div>
          ))}
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
  const resolvedLocale = locale || 'en';
  
  return {
    props: {
      ...(await serverSideTranslations(resolvedLocale, ['common'])),
    },
  };
}