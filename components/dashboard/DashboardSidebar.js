import { useRouter } from 'next/router';
import { X, LayoutDashboard, Link2, BarChart2, User, Key, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { useAuth } from '@/contexts/AuthContext';

// Navigation Config
const MENU_ITEMS = [
  { 
    key: 'Overview',
    path: '/dashboard',
    icon: LayoutDashboard
  },
  { 
    key: 'My Links',
    path: '/dashboard/links',
    icon: Link2
  },
  { 
    key: 'Analytics',
    path: '/dashboard/analytics',
    icon: BarChart2
  }
];

const SETTINGS_ITEMS = [
  { 
    key: 'Account',
    path: '/dashboard/settings/account',
    icon: User
  },
  { 
    key: 'API Keys',
    path: '/dashboard/settings/api-keys',
    icon: Key
  },
  { 
    key: 'Subscription',
    path: '/dashboard/settings/subscription',
    icon: CreditCard
  }
];

// NavSection Component
const NavSection = ({ title, items, currentPath }) => (
  <div className="space-y-1">
    <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {title}
    </h3>
    {items.map(({ key, path, icon: Icon }) => {
      const isActive = path === currentPath || 
                      (path !== '/dashboard' && currentPath.startsWith(path));
      
      return (
        <Link
          key={path}
          href={path}
          className={`
            flex items-center px-3 py-2 mx-2 text-sm font-medium rounded-lg
            transition-all duration-200 group
            ${isActive 
              ? 'bg-secondary text-white shadow-sm' 
              : 'text-gray-700 hover:bg-gray-100'}
          `}
        >
          <Icon 
            className={`
              mr-3 h-5 w-5 transition-transform duration-200
              group-hover:scale-110
              ${isActive ? 'text-white' : 'text-gray-500'}
            `}
          />
          <span className="truncate">{key}</span>
          
          {isActive && (
            <span className="ml-auto h-2 w-2 rounded-full bg-white/30" />
          )}
        </Link>
      );
    })}
  </div>
);

// Subscription Status Component
const SubscriptionStatus = () => {
  const { user } = useAuth();
  
  const { data: limits, error } = useSWR(
    user ? '/api/dashboard/subscription-limits' : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch subscription limits');
      return res.json();
    }
  );

  const isLoading = !limits && !error;

  return (
    <div className="flex items-center px-2 py-3 rounded-lg bg-gray-50">
      <div className="flex-1 min-w-0">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        ) : error ? (
          <div className="text-sm text-gray-500">
            Failed to load usage info
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700 truncate">
              {limits?.planName || 'Free'} Plan
            </p>
            <p className="text-xs text-gray-500 truncate">
              {limits?.remainingLinks || 0} links remaining today
            </p>
          </>
        )}
      </div>
      <div className="flex-shrink-0">
        <Link 
          href="/dashboard/settings/subscription"
          className="text-xs font-medium text-secondary hover:text-blue-700"
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
};

// Main Sidebar Component
const DashboardSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const router = useRouter();

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-64 bg-white border-r z-50
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:z-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 
                   hover:bg-gray-100 md:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full pt-16 md:pt-8 pb-6">
          {/* Logo Section */}
          <div className="px-6 mb-8">
            <Image 
              src="/logo.png"
              alt="Logo" 
              width={32}
              height={32}
              className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity" 
            />
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 px-3 space-y-8 overflow-y-auto">
            <NavSection 
              title="Menu" 
              items={MENU_ITEMS}
              currentPath={router.pathname} 
            />
            <NavSection 
              title="Settings" 
              items={SETTINGS_ITEMS}
              currentPath={router.pathname} 
            />
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto px-6 py-4 border-t">
            <SubscriptionStatus />
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;