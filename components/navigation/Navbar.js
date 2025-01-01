import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { NAV_ITEMS } from './navConfig';
import NavItem from './NavItem';
import AuthButtons from './AuthButtons';
import LocaleSwitcher from './LocaleSwitcher';
import MobileMenu from './MobileMenu';
import LogoWithName from '../LogoWithName';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <nav className={`
      sticky top-0 w-full z-40 transition-all duration-300
      ${isScrolled 
        ? 'bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm shadow-sm' 
        : 'bg-white dark:bg-dark-surface'
      }
    `}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <LogoWithName />

          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(({ key, path }) => (
              <NavItem
                key={key}
                href={path}
                isActive={path === '/' ? router.pathname === path : router.pathname.startsWith(path)}
              >
                {key}
              </NavItem>
            ))}

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-primary-200 dark:border-dark-lighter">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-dark-lighter
                transition-colors duration-200 text-primary-600 dark:text-primary-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <AuthButtons />
              <LocaleSwitcher />
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-full text-primary-600 dark:text-primary-200
            hover:bg-primary-50 dark:hover:bg-dark-lighter
            active:bg-primary-100 dark:active:bg-dark-lightest
            transition-colors duration-200 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </nav>
  );
};

export default Navbar;