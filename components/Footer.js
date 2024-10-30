import { useTranslation } from 'next-i18next';
import { FooterBrand } from './footer/FooterBrand';
import { FooterLinkGroup } from './footer/FooterLinkGroup';
import { FooterBottom } from './footer/FooterBottom';

const Footer = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { href: '/features', label: t('footer.links.product.features') },
    { href: '/pricing', label: t('footer.links.product.pricing') },
    { href: '/api-docs', label: t('footer.links.product.apiDocs') },
    { href: '/blog', label: t('footer.links.product.blog') }
  ];

  const companyLinks = [
    { href: '/about', label: t('footer.links.company.about') },
    { href: '/contact', label: t('footer.links.company.contact') },
    { href: '/status', label: t('footer.links.company.status') }
  ];

  const legalLinks = [
    { href: '/legal/privacy', label: t('footer.links.legal.privacyPolicy') },
    { href: '/legal/terms', label: t('footer.links.legal.terms') },
    { href: '/legal/cookies', label: t('footer.links.legal.cookiePolicy') },
    { href: '/legal/acceptable-use', label: t('footer.links.legal.acceptableUse') },
    { href: '/legal/dmca', label: t('footer.links.legal.dmca') },
    { href: '/legal/refund', label: t('footer.links.legal.refundPolicy') },
    { href: '/legal/shipping', label: t('footer.links.legal.shipping') },
    { href: '/legal/disclaimer', label: t('footer.links.legal.disclaimer') }
  ];

  const socialLinks = [
    { href: 'https://twitter.com/minifyn', label: t('footer.links.social.twitter') },
    { href: 'https://github.com/minifyn', label: t('footer.links.social.github') }
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FooterBrand tagline={t('footer.tagline')} />
          <FooterLinkGroup title={t('footer.product')} links={productLinks} />
          <FooterLinkGroup title={t('footer.company')} links={companyLinks} />
          <FooterLinkGroup title={t('footer.legal')} links={legalLinks} />
        </div>
        <FooterBottom
          copyright={`© ${currentYear} MiniFyn. ${t('footer.allRightsReserved')}`}
          socialLinks={socialLinks}
        />
      </div>
    </footer>
  );
};

export default Footer;