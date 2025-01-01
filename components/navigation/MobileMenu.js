import { useRouter } from 'next/router';
import { X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { NAV_ITEMS } from './navConfig';
import NavItem from './NavItem';
import AuthButtons from './AuthButtons';
import LocaleSwitcher from './LocaleSwitcher';

const MobileMenu = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[99] md:hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className={`
        absolute right-0 top-0 h-full w-72 bg-white dark:bg-dark-surface shadow-lg 
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-primary-500 dark:text-primary-400 
            hover:bg-primary-50 dark:hover:bg-dark-lighter active:bg-primary-100 dark:active:bg-dark-lightest 
            transition-colors duration-200"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

          <div className="mt-8 space-y-6">
            {NAV_ITEMS.map(({ key, path }) => (
              <NavItem
                key={key}
                href={path}
                isActive={path === '/' ? router.pathname === path : router.pathname.startsWith(path)}
                className="block w-full text-lg"
              >
                {key}
              </NavItem>
            ))}

            <div className="pt-6 border-t border-primary-200 dark:border-dark-lighter flex items-center justify-between">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-dark-lighter 
                transition-colors duration-200 flex items-center gap-2"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={20} />
                    <span className="text-primary-700 dark:text-primary-200">Light mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={20} />
                    <span className="text-primary-700 dark:text-primary-200">Dark mode</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-6 border-t border-primary-200 dark:border-dark-lighter">
              <AuthButtons isMobile />
            </div>

            <div className="pt-6 border-t border-primary-200 dark:border-dark-lighter">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;