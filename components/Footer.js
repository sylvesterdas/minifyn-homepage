import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Footer = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { href: '/privacy-policy', label: t('privacyPolicy') },
    { href: '/terms', label: t('termsOfService') },
    { href: '/cookie-policy', label: t('cookiePolicy') },
    { href: '/acceptable-use', label: t('acceptableUse') },
    { href: '/dmca', label: t('dmca') },
    { href: '/refund-policy', label: t('refundPolicy') },
    { href: '/disclaimer', label: t('disclaimer') }
  ];

  const productLinks = [
    { href: '/features', label: t('features') },
    { href: '/pricing', label: t('pricing') },
    { href: '/api-docs', label: t('apiDocs') },
    { href: '/blog', label: t('blog') }
  ];

  const companyLinks = [
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
    { href: '/status', label: t('status') }
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">MiniFyn</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              {t('footerTagline')}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              {t('product')}
            </h3>
            <ul className="mt-4 space-y-4">
              {productLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              {t('company')}
            </h3>
            <ul className="mt-4 space-y-4">
              {companyLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              {t('legal')}
            </h3>
            <ul className="mt-4 space-y-4">
              {legalLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              © {currentYear} MiniFyn. {t('allRightsReserved')}
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="https://twitter.com/minifyn" className="text-gray-300 hover:text-white">
                Twitter
              </a>
              <a href="https://github.com/minifyn" className="text-gray-300 hover:text-white">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;