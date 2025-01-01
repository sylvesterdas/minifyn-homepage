import Link from 'next/link';
import { useState } from 'react';

const NavItem = ({ href, isActive, children, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative px-3 py-2 text-sm font-medium
        ${isActive ? 'text-secondary-500' : 'text-primary-600 dark:text-primary-200'}
        hover:text-secondary-500 transition-colors duration-200
        ${className}
      `}
    >
      {children}
      {(isHovered || isActive) && (
        <span 
          className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary-500
            transform origin-left transition-transform duration-200" 
        />
      )}
    </Link>
  );
};

export default NavItem;