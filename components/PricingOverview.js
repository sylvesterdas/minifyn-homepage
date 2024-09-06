import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/authUtils';

const PricingCard = ({ plan, features, price, ctaText, ctaRoute, isDisabled }) => {
  const router = useRouter();

  const handleClick = () => {
    if (!isDisabled) {
      router.push(ctaRoute);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-2">{plan}</h3>
        <p className="text-2xl font-bold mb-4">{price}</p>
        <ul className="mb-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center mb-2">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <button 
        className={`w-full font-semibold py-2 px-4 rounded transition-colors ${
          isDisabled 
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
            : 'bg-secondary text-white hover:bg-opacity-90'
        }`}
        disabled={isDisabled}
        onClick={handleClick}
      >
        {ctaText}
      </button>
    </div>
  );
};

const PricingOverview = () => {
  const { t } = useTranslation('pricing');

  const pricingData = [
    {
      plan: 'Free',
      price: '₹0/month',
      features: [
        '10 URLs per hour',
        '50 URLs per day',
        '60-day link validity',
        'Basic analytics'
      ],
      ctaText: isAuthenticated() ? t('cta.dashboard') : t('cta.free'),
      ctaRoute: isAuthenticated() ? '/dashboard' : '/signup',
      isDisabled: false
    },
    {
      plan: 'Pro',
      price: '₹--/month',
      features: [
        'Unlimited URLs',
        '1-year link validity',
        'Advanced analytics',
        'Custom short links'
      ],
      ctaText: t('cta.proComingSoon'),
      ctaRoute: '/',
      isDisabled: true
    }
  ];

  return (
    <section id="pricing" className="py-12 bg-light-gray">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">{t('overview.title')}</h2>
        <p className="text-xl text-center text-gray-600 mb-8">{t('overview.subtitle')}</p>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {pricingData.map((plan, index) => (
            <PricingCard 
              key={index}
              plan={plan.plan}
              price={plan.price}
              features={plan.features}
              ctaText={plan.ctaText}
              ctaRoute={plan.ctaRoute}
              isDisabled={plan.isDisabled}
            />
          ))}
        </div>
        <div className="text-center hidden">
          <Link href="/pricing" className="text-secondary hover:underline">
            {t('detailedComparison')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingOverview;