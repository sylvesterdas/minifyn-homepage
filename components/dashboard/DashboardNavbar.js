import Link from 'next/link';
import { useState } from 'react';
import { Menu, Bell, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Image from 'next/image';

const NavbarDropdownItem = ({ icon: Icon, label, onClick, href }) => {
  const Component = href ? Link : 'button';
  const props = href ? { href } : { onClick };

  return (
    <Component
      {...props}
      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 
                 hover:bg-gray-100 transition-colors"
    >
      <Icon size={16} className="mr-2" />
      {label}
    </Component>
  );
};

const DashboardNavbar = ({ setSidebarOpen }) => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo.png" alt="Logo" className="h-8 w-8" width={32} height={32} />
            <span className="text-xl font-bold text-primary ml-4">Dashboard</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Help */}
          <Link 
            href="/api-docs"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Documentation"
          >
            <HelpCircle size={20} />
          </Link>

          {/* Notifications */}
          <Link
            href="/dashboard/notifications"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 
                         rounded-lg transition-colors"
            >
              <User size={20} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 py-1 bg-white rounded-lg 
                              shadow-lg border z-20">
                  <NavbarDropdownItem
                    href="/dashboard/settings/account"
                    icon={User}
                    label="Account"
                  />
                  <NavbarDropdownItem
                    href="/dashboard/settings"
                    icon={Settings}
                    label="Settings"
                  />
                  <hr className="my-1" />
                  <NavbarDropdownItem
                    icon={LogOut}
                    label="Logout"
                    onClick={handleLogout}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;