
import { useRouter } from 'next/router';
import { X } from 'lucide-react';
import { NAV_ITEMS } from './navConfig';
import NavItem from './NavItem';
import AuthButtons from './AuthButtons';
import LocaleSwitcher from './LocaleSwitcher';

const MobileMenu = ({ isOpen, onClose }) => {
  const router = useRouter();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[99] md:hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div 
        className={`
          absolute right-0 top-0 h-full w-72 bg-white shadow-lg 
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-6 bg-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-500 
                       hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
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
            
            <div className="pt-6 border-t">
              <AuthButtons isMobile />
            </div>
            
            <div className="pt-6 border-t">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
