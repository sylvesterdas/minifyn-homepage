export const FooterBottom = ({ copyright, socialLinks }) => {
  return (
    <div className="mt-8 pt-8 border-t border-gray-700 dark:border-gray-600">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-300 dark:text-gray-400">{copyright}</p>
        <div className="mt-4 md:mt-0 flex space-x-6">
          {socialLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};