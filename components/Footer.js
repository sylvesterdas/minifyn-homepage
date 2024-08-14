import Link from 'next/link';

const Footer = () => (
  <footer className="bg-white border-t border-gray-200">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-primary">MiniFyn</span>
          <p className="text-sm text-gray-600">© 2024 MiniFyn. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;