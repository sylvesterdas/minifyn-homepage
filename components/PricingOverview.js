import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Check } from 'lucide-react';

const PricingCard = ({ plan, features, price, ctaText, ctaRoute, isComingSoon }) => {
  const router = useRouter();

  const handleClick = () => {
    if (!isComingSoon) {
      router.push(ctaRoute);
    }
  };

  return (
    <div className={`bg-white rounded-lg ${
      isComingSoon 
        ? 'border border-dashed border-gray-300 bg-gray-50' 
        : 'border border-gray-200 shadow-md'
    } p-6 flex flex-col justify-between`}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-semibold">{plan}</h3>
          {isComingSoon && (
            <Clock className="w-5 h-5 text-blue-500" />
          )}
        </div>
        <p className="text-2xl font-bold mb-4">{price}</p>
        <ul className="mb-4 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className={`w-4 h-4 ${isComingSoon ? 'text-gray-400' : 'text-green-500'}`} />
              <span className={isComingSoon ? 'text-gray-500' : 'text-gray-700'}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <button 
        className={`w-full font-semibold py-2 px-4 rounded transition-colors ${
          isComingSoon 
            ? 'bg-gray-100 text-gray-600 cursor-default flex items-center justify-center gap-2' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        disabled={isComingSoon}
        onClick={handleClick}
      >
        {isComingSoon && <Clock className="w-4 h-4" />}
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
      isComingSoon: false
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
      isComingSoon: true
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-light-gray to-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">{t('overview.title')}</h2>
        <p className="text-xl text-center text-gray-600 mb-8">{t('overview.subtitle')}</p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
          {pricingData.map((plan, index) => (
            <PricingCard 
              key={index}
              plan={plan.plan}
              price={plan.price}
              features={plan.features}
              ctaText={plan.ctaText}
              ctaRoute={plan.ctaRoute}
              isComingSoon={plan.isComingSoon}
            />
          ))}
        </div>

        <div className="text-center">
          <Link href="/pricing" className="text-blue-600 hover:underline">
            {t('detailedComparison')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingOverview;