// components/DashboardSidebar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Layout, 
  Link as LinkIcon, 
  BarChart, 
  User, 
  Key, 
  CreditCard 
} from 'lucide-react';

export default function DashboardSidebar() {
  const router = useRouter();
  
  const mainMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Layout },
    { href: '/dashboard/links', label: 'My Links', icon: LinkIcon },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart },
  ];

  const settingsMenuItems = [
    { href: '/dashboard/settings/account', label: 'Account', icon: User },
    { href: '/dashboard/settings/api-keys', label: 'API Keys', icon: Key },
    { href: '/dashboard/settings/subscription', label: 'Subscription', icon: CreditCard },
  ];

  const isActive = (path) => router.pathname === path;

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <nav className="p-4 space-y-8">
        {/* Main Menu */}
        <div>
          <div className="px-3 mb-2 text-sm font-medium text-dark-gray">Menu</div>
          <div className="space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-secondary text-white'
                      : 'text-dark-gray hover:bg-light-gray'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Settings Menu */}
        <div>
          <div className="px-3 mb-2 text-sm font-medium text-dark-gray">Settings</div>
          <div className="space-y-1">
            {settingsMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                    router.pathname.startsWith(item.href)
                      ? 'bg-secondary text-white'
                      : 'text-dark-gray hover:bg-light-gray'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}