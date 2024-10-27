import React from 'react';
import { useTranslation } from 'next-i18next';
import { TRANSLATION_KEYS, FEATURE_KEYS } from '../constants/text';
import { QRCodeIcon } from '../components/Icons';

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
    <section id="features" className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-light-gray">
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
