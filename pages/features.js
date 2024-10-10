import React from 'react';
import LinkA from 'next/link'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Check, X, Link, BarChart2, Code } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <div className="flex items-center space-x-3">
        <Icon className="w-6 h-6 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

const FeatureComparison = ({ feature, free, pro }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="py-3 px-4">{feature}</td>
    <td className="py-3 px-4 text-center">
      {typeof free === 'boolean' ? (
        free ? <Check className="inline-block text-green-500" /> : <X className="inline-block text-red-500" />
      ) : (
        <span className="text-sm font-medium">{free}</span>
      )}
    </td>
    <td className="py-3 px-4 text-center">
      {typeof pro === 'boolean' ? (
        pro ? <Check className="inline-block text-green-500" /> : <X className="inline-block text-red-500" />
      ) : (
        <span className="text-sm font-medium">{pro}</span>
      )}
    </td>
  </tr>
);

export default function FeaturesPage() {
  const { t } = useTranslation('common');

  const features = [
    { icon: Link, title: t('features.basicCapabilities.urlShortening'), description: t('features.descriptions.urlShortening') },
    // { icon: Zap, title: t('features.basicCapabilities.qrCodeGeneration'), description: t('features.descriptions.qrCodeGeneration') },
    { icon: BarChart2, title: t('features.basicCapabilities.linkAnalytics'), description: t('features.descriptions.linkAnalytics') },
    // { icon: Globe, title: t('features.basicCapabilities.customization'), description: t('features.descriptions.customization') },
    { icon: Code, title: t('features.basicCapabilities.apiAccess'), description: t('features.descriptions.apiAccess') },
  ];

  const comparisonFeatures = [
    { name: t('features.comparison.urlShortening'), free: true, pro: true },
    { name: t('features.comparison.customAliases'), free: false, pro: true },
    { name: t('features.comparison.qrCodes'), free: true, pro: true },
    { name: t('features.comparison.analytics'), free: 'Basic', pro: 'Advanced' },
    { name: t('features.comparison.apiAccess'), free: 'Limited', pro: 'Full' },
    // { name: t('features.comparison.urlsPerHour'), free: '10', pro: '50' },
    { name: t('features.comparison.urlsPerDay'), free: '10', pro: '50' },
    { name: t('features.comparison.linkValidity'), free: '60 days', pro: '1 year' },
    { name: t('features.comparison.bulkShortening'), free: false, pro: true },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-screen-xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{t('features.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('features.whatWeDoDescription')}</p>
        </section>
        
        {/* Core Capabilities Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">{t('features.basicCapabilitiesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>
        
        {/* Subscription Comparison Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">{t('features.comparisonTitle')}</h2>
          <div className="overflow-x-auto max-w-screen-xl mx-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">{t('features.comparison.feature')}</th>
                  <th className="py-3 px-4 text-center">{t('features.comparison.free')}</th>
                  <th className="py-3 px-4 text-center">{t('features.comparison.pro')}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <FeatureComparison 
                    key={index}
                    feature={feature.name}
                    free={feature.free}
                    pro={feature.pro}
                  />
                ))}
                <tr>
                  <td className="py-4 px-4"></td>
                  <td className="py-4 px-4 text-center">
                    <LinkA href="/signup" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                      {t('features.comparison.signUpFree')}
                    </LinkA>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <LinkA href="/signup?plan=pro" className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors" >
                      {t('features.comparison.signUpPro')}
                    </LinkA>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
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