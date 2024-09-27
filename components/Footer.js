import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Footer = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
          <div className="mb-4 md:mb-0 flex flex-col text-center lg:text-start">
            <span className="font-bold text-primary">MiniFyn</span>
            <p className="text-sm text-gray-600">{t('copyright', { year: new Date().getFullYear() })}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end space-x-4">
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">{t('about')}</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">{t('contactUs')}</Link>
            <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900">{t('privacyPolicy')}</Link>
            <Link href="/disclaimer" className="text-sm text-gray-600 hover:text-gray-900">{t('disclaimer')}</Link>
            <Link href="/terms-and-conditions" className="text-sm text-gray-600 hover:text-gray-900">{t('termsAndConditions')}</Link>
            <Link href="/refund-and-cancellation" className="text-sm text-gray-600 hover:text-gray-900">{t('refundAndCancellation')}</Link>
            <Link href="/shipping-and-delivery" className="text-sm text-gray-600 hover:text-gray-900">{t('shippingAndDelivery')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;