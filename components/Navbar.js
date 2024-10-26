import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LogoWithName from './LogoWithName';
import Dropdown from './Dropdown';

// Centralized navigation configuration
const NAV_ITEMS = [
  { key: 'HOME', path: '/' },
  { key: 'FEATURES', path: '/features' },
  { key: 'BLOG', path: '/blog' },
  { key: 'PRICING', path: '/pricing' },
  { key: 'API_DOCS', path: '/api-docs' }
];

const LocaleSwitcher = () => {
  const router = useRouter();
  const localeOptions = {
    en: "English",
    hi: "हिंदी"
  };

  return (
    <div className="w-max">
      <Dropdown 
        options={localeOptions} 
        onChange={(locale) => router.push(router.pathname, router.asPath, { locale })}
        selected={router.locale} 
      />
    </div>
  );
};

const NavLink = ({ href, children, className = "" }) => (
  <Link 
    href={href}
    className={`text-gray-700 hover:text-gray-900 transition-colors ${className}`}
  >
    {children}
  </Link>
);

const NavButton = ({ onClick, children, className = "" }) => (
  <button 
    onClick={onClick}
    className={`text-gray-700 hover:text-gray-900 transition-colors ${className}`}
  >
    {children}
  </button>
);

const AuthSection = ({ isMobile = false }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const baseClass = isMobile
    ? "block w-full px-3 py-2 text-base font-medium"
    : "";

  const ctaClass = isMobile
    ? "block w-full px-3 py-2 text-base font-medium bg-secondary text-white hover:bg-blue-600"
    : "bg-secondary text-white px-3 py-2 rounded hover:bg-blue-600 transition duration-300";

  if (user) {
    return (
      <>
        <NavLink href="/dashboard" className={baseClass}>
          {t('nav.dashboard')}
        </NavLink>
        <NavButton onClick={handleLogout} className={baseClass}>
          {t('cta.logout')}
        </NavButton>
      </>
    );
  }

  return (
    <>
      <NavLink href="/login" className={baseClass}>
        {t('cta.login')}
      </NavLink>
      <NavLink href="/signup" className={ctaClass}>
        {t('cta.signup')}
      </NavLink>
    </>
  );
};

const Navbar = () => {
  const { t } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => setIsMenuOpen(false);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  const navbarClasses = `sticky top-0 z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white bg-opacity-80 backdrop-blur-sm shadow-md' : 'bg-white'
  }`;

  const isActivePath = (path) => {
    if (path === '/') return router.pathname === path;
    return router.pathname.startsWith(path);
  };

  return (
    <nav className={navbarClasses}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <LogoWithName />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {NAV_ITEMS.map(({ key, path }) => (
              <NavLink 
                key={key} 
                href={path}
                className={isActivePath(path) ? 'text-secondary font-medium' : ''}
              >
                {t(`nav.${key.toLowerCase()}`)}
              </NavLink>
            ))}
            <AuthSection />
            <LocaleSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_ITEMS.map(({ key, path }) => (
              <NavLink
                key={key}
                href={path}
                className={`block px-3 py-2 text-base font-medium ${
                  isActivePath(path) ? 'text-secondary' : ''
                }`}
              >
                {t(`nav.${key.toLowerCase()}`)}
              </NavLink>
            ))}
            <AuthSection isMobile />
            <div className="px-3 py-2">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;