'use client'

import React from 'react';
import Navbar from './navigation/Navbar';
import Footer from './Footer';
import { useRouter } from 'next/router';
import { GoogleAnalytics } from '@next/third-parties/google'

const PublicLayout = ({ children }) => {
  const router = useRouter();

  if (router.route !== '/[shortCode]') {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} debugMode={false} />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return <main className="flex-grow">{children}</main>;
};

export default PublicLayout;