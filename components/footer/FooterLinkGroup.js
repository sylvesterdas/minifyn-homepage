import Link from "next/link";

export const FooterLinkGroup = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h3>
      <ul className="mt-4 space-y-4">
        {links.map(({ href, label, newTab = false }) => (
          <li key={href}>
            <Link 
              href={href} 
              target={newTab ? '_blank' : '_self'}
              className="text-sm text-gray-300 hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};