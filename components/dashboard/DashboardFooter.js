import Link from 'next/link';

const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-2 sm:mb-0">
            © {currentYear} MiniFyn. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/legal/terms" 
              className="hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms
            </Link>
            <Link 
              href="/legal/privacy" 
              className="hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy
            </Link>
            <Link 
              href="/api-docs" 
              className="hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;