import Link from 'next/link';

const DashboardNavItem = ({ href, icon: Icon, isActive, children }) => (
  <Link
    href={href}
    className={`
      flex items-center px-3 py-2 text-sm rounded-lg transition-colors
      ${isActive 
        ? 'bg-secondary text-white' 
        : 'text-dark-gray hover:bg-light-gray'
      }
    `}
  >
    <Icon className="mr-3 h-5 w-5" />
    {children}
  </Link>
);

export default DashboardNavItem;