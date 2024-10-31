import Link from 'next/link';

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

export default NavSection;