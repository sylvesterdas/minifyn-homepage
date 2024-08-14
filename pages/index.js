import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import UrlShortener from '../components/UrlShortener';
import QRCodeGenerator from '../components/QRCodeGenerator';
import UsageLimits from '../components/UsageLimits';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState('url');
  const userType = 'anonymous'; // This could be 'anonymous', 'free', or 'pro'

  return (
    <div className="font-sans">
      <Head>
        <title>MiniFyn - Simplify Your Links</title>
        <meta name="description" content="Shorten, share, and track your links with MiniFyn" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main>
        <div className="bg-gradient-to-br from-primary via-secondary to-teal relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="md:flex md:items-center md:justify-between">
              <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Simplify Your Links</h1>
                <p className="text-xl mb-4 text-light-gray">Shorten, share, and track your links with MiniFyn</p>
              </div>
              <div className="md:w-1/2 md:max-w-md mx-auto">
                <div className="bg-white bg-opacity-10 rounded-lg shadow-lg backdrop-blur-sm overflow-hidden">
                  <div className="flex border-b border-white border-opacity-20">
                    <button
                      className={`flex-1 py-2 px-4 focus:outline-none ${activeTab === 'url' ? 'bg-white bg-opacity-20' : ''}`}
                      onClick={() => setActiveTab('url')}
                    >
                      URL Shortener
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 focus:outline-none ${activeTab === 'qr' ? 'bg-white bg-opacity-20' : ''}`}
                      onClick={() => setActiveTab('qr')}
                    >
                      QR Code
                    </button>
                  </div>
                  <div className="p-6 h-[370px] overflow-y-auto">
                    {activeTab === 'url' ? (
                      <>
                        <UrlShortener />
                        <UsageLimits userType={userType} />
                      </>
                    ) : (
                      <QRCodeGenerator />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}