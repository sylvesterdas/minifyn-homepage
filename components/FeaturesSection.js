import React from 'react';
import { useTranslation } from 'next-i18next';
import { TRANSLATION_KEYS, FEATURE_KEYS } from '../constants/text';

const Feature = ({ icon, titleKey, descriptionKey }) => {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{t(titleKey)}</h3>
      <p className="text-sm sm:text-base text-gray-600">{t(descriptionKey)}</p>
    </div>
  );
};

const QRCodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <rect x="7" y="7" width="3" height="3"/>
    <rect x="14" y="7" width="3" height="3"/>
    <rect x="7" y="14" width="3" height="3"/>
    <line x1="14" y1="14" x2="17" y2="14"/>
    <line x1="14" y1="17" x2="17" y2="17"/>
  </svg>
);

const FEATURE_ICONS = {
  QUICK_LINK_SHORTENING: '🔗',
  DETAILED_ANALYTICS: '📊',
  SECURE_AND_RELIABLE: '🔒',
  QR_CODE_GENERATION: <QRCodeIcon />,
  BULK_URL_SHORTENING: '📚',
}

const FeaturesSection = () => {
  const { t } = useTranslation('common');

  const features = FEATURE_KEYS.map(key => ({
    icon: FEATURE_ICONS[key],
    titleKey: `${TRANSLATION_KEYS.FEATURES[key]}.title`,
    descriptionKey: `${TRANSLATION_KEYS.FEATURES[key]}.description`,
  }));

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-light-gray">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">{t('whyChooseMiniFyn')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;