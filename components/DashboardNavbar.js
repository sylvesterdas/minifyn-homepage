import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { logout } from '../lib/authUtils';

const DashboardNavbar = ({ user, setUser, setSidebarOpen }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleLogout = () => {
    logout(setUser);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button
                className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/dashboard">
                <span className="text-xl font-bold text-primary ml-4">MiniFyn Dashboard</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="bg-secondary text-white px-3 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;