import Link from 'next/link';

const Navbar = () => (
  <nav className="bg-white border-b border-gray-200">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <div>
            <Link href="/" className="flex items-center py-5 px-2">
              <span className="font-bold text-primary">MiniFyn</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="py-5 px-3 text-gray-700 hover:text-gray-900">Home</Link>
            <Link href="/features" className="py-5 px-3 text-gray-700 hover:text-gray-900">Features</Link>
            <Link href="/pricing" className="py-5 px-3 text-gray-700 hover:text-gray-900">Pricing</Link>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-1">
          <Link href="/login" className="py-5 px-3">Login</Link>
          <Link href="/signup" className="py-2 px-3 bg-secondary text-white hover:bg-blue-600 rounded transition duration-300">Signup</Link>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;