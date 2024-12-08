'use client'

import React from 'react';
import Navbar from './navigation/Navbar';
import Footer from './Footer';
import { useRouter } from 'next/router';
import { GoogleAnalytics } from '@next/third-parties/google'

const PublicLayout = ({ children }) => {
  const router = useRouter();

  const body = (
    <main className="flex-grow">
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} debugMode={process.env.NODE_ENV === 'development'} />
      {children}
    </main>
  )

  if (router.route !== '/[shortCode]') {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
          {body}
        <Footer />
      </div>
    );
  }

  return body;
};

export default PublicLayout;