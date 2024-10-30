import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from 'lucide-react';
import { NAV_ITEMS } from './navConfig';
import NavItem from './NavItem';
import AuthButtons from './AuthButtons';
import LocaleSwitcher from './LocaleSwitcher';
import MobileMenu from './MobileMenu';
import LogoWithName from '../LogoWithName';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`
        sticky top-0 w-full z-40 transition-all duration-300
        ${isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-white'}
      `}
    >
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
            
            <div className="flex items-center gap-3 ml-4 pl-4 border-l">
              <AuthButtons />
              <LocaleSwitcher />
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-full text-gray-700 hover:bg-gray-100 
                     active:bg-gray-200 transition-colors duration-200 md:hidden"
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