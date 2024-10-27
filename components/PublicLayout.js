import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/router';

const PublicLayout = ({ children, user, setUser }) => {
  const router = useRouter();

  if (router.route !== '/[shortCode]')
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    );
  return (
    <main className="flex-grow">
      {children}
    </main>
  );
};

export default PublicLayout;