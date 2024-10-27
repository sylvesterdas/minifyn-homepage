import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

const PricingCard = ({ plan, features, price, ctaText, ctaRoute, isDisabled }) => {
  const router = useRouter();

  const handleClick = () => {
    if (!isDisabled) {
      router.push(ctaRoute);
    }
  };

  return (
    <div className={`bg-white ${plan == 'Link Pro' ? 'border-2 border-blue-500 shadow-xl z-10 lg:-mt-4 lg:-mb-4' : 'lg:mr-4'} rounded-lg shadow-md p-6 flex flex-col justify-between`}>
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
  const { t: tC } = useTranslation('common');
  const { user } = useAuth();

  const pricingData = [
    {
      plan: tC('pricing.freePlan.title'),
      price: '₹0/month',
      features: [
        tC('pricing.freePlan.feature1'),
        tC('pricing.freePlan.feature2'),
        tC('pricing.freePlan.feature3'),
      ],
      ctaText: user ? t('cta.dashboard') : t('cta.free'),
      ctaRoute: user ? '/dashboard' : '/signup',
      isDisabled: false
    },
    {
      plan: tC('pricing.proPlan.title'),
      price: '₹99/month',
      features: [
        tC('pricing.proPlan.feature1'),
        tC('pricing.proPlan.feature2'),
        tC('pricing.proPlan.feature3'),
        tC('pricing.proPlan.feature4'),
      ],
      ctaText: t('cta.proComingSoon'),
      ctaRoute: '/',
      isDisabled: true
    }
  ];

  return (
    <section id="pricing" className="py-12 bg-gradient-to-b from-light-gray to-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">{t('overview.title')}</h2>
        <p className="text-xl text-center text-gray-600 mb-8">{t('overview.subtitle')}</p>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {pricingData.map((plan, index) => (
            <div
              key={index}
              className={`${index%2 === 0 ? 'order-2 md:order-1' : 'order-1 md:order-2'}`}
            >
              <PricingCard 
                plan={plan.plan}
                price={plan.price}
                features={plan.features}
                ctaText={plan.ctaText}
                ctaRoute={plan.ctaRoute}
                isDisabled={plan.isDisabled}
              />
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/pricing" className="text-secondary hover:underline">
            {t('detailedComparison')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingOverview;