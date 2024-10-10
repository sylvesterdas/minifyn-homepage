import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { TRANSLATION_KEYS } from '../constants/text';
import { useAuth } from '@/contexts/AuthContext';
import LogoWithName from './LogoWithName';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (locale) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  const handleLogout = async () => {
    await logout();
    return router.push('/');
  };

  const AuthLinks = () => (
    user ? (
      <>
        <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">{t(TRANSLATION_KEYS.NAV_LINKS.DASHBOARD)}</Link>
        <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900">{t(TRANSLATION_KEYS.CTA.LOGOUT)}</button>
      </>
    ) : (
      <>
        <Link href="/login" className="text-gray-700 hover:text-gray-900">{t(TRANSLATION_KEYS.CTA.LOGIN)}</Link>
        <Link href="/signup" className="bg-secondary text-white px-3 py-2 rounded hover:bg-blue-600 transition duration-300">{t(TRANSLATION_KEYS.CTA.SIGNUP)}</Link>
      </>
    )
  );

  const navbarClasses = `sticky top-0 z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white bg-opacity-80 backdrop-blur-sm shadow-md' : 'bg-white'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <LogoWithName />
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900">{t(TRANSLATION_KEYS.NAV_LINKS.HOME)}</Link>
            <Link href="/features" className="text-gray-700 hover:text-gray-900">{t(TRANSLATION_KEYS.NAV_LINKS.FEATURES)}</Link>
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900">{t(TRANSLATION_KEYS.NAV_LINKS.PRICING)}</Link>
            <AuthLinks />
            <select 
              onChange={(e) => changeLanguage(e.target.value)}
              value={router.locale}
              className="border rounded px-2 py-1"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{t(TRANSLATION_KEYS.NAV_LINKS.HOME)}</Link>
            <Link href="/features" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{t(TRANSLATION_KEYS.NAV_LINKS.FEATURES)}</Link>
            <Link href="/pricing" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{t(TRANSLATION_KEYS.NAV_LINKS.PRICING)}</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{t(TRANSLATION_KEYS.NAV_LINKS.DASHBOARD)}</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{t(TRANSLATION_KEYS.CTA.LOGOUT)}</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{t(TRANSLATION_KEYS.CTA.LOGIN)}</Link>
                <Link href="/signup" className="block px-3 py-2 text-base font-medium bg-secondary text-white hover:bg-blue-600">{t(TRANSLATION_KEYS.CTA.SIGNUP)}</Link>
              </>
            )}
            <div className="px-3 py-2">
              <select 
                onChange={(e) => changeLanguage(e.target.value)}
                value={router.locale}
                className="w-full border rounded px-2 py-1"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;