import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Footer = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-primary">MiniFyn</span>
            <p className="text-sm text-gray-600">{t('copyright', { year: new Date().getFullYear() })}</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">{t('privacyPolicy')}</Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">{t('termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;