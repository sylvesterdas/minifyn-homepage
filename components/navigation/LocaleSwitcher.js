import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown } from 'lucide-react';

const LocaleSwitcher = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const languages = {
    en: { name: "English", flag: "🇺🇸" },
    hi: { name: "हिंदी", flag: "🇮🇳" }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 
                   hover:text-secondary transition-colors duration-200 rounded-md
                   hover:bg-gray-50 active:bg-gray-100"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{languages[router.locale].flag}</span>
        <ChevronDown 
          size={16} 
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 
                     overflow-hidden transform opacity-100 scale-100 transition-all duration-200"
          role="menu"
        >
          {Object.entries(languages).map(([code, { name, flag }]) => (
            <button
              key={code}
              onClick={() => {
                router.push(router.pathname, router.asPath, { locale: code });
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-2 text-sm text-left flex items-center gap-2
                ${router.locale === code ? 'text-secondary bg-blue-50' : 'text-gray-700'}
                hover:bg-gray-50 transition-colors duration-150
              `}
              role="menuitem"
            >
              <span className="text-base">{flag}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocaleSwitcher;