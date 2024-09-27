import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LogoWithName from './LogoWithName';

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const navItems = [
    { href: '/dashboard', label: 'dashboard' },
    // { href: '/dashboard/urls', label: 'my_urls' },
    // { href: '/dashboard/analytics', label: 'analytics' },
    // { href: '/dashboard/settings', label: 'settings' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity duration-300 ease-linear ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white overflow-y-auto transition duration-300 transform ${
          sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        } md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-between flex-shrink-0 px-4 py-4">
          <Link href="/">
            <LogoWithName />
          </Link>
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={`block py-2.5 px-4 rounded transition duration-200 capitalize ${
                router.pathname === item.href 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-500'
              }`}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default DashboardSidebar;