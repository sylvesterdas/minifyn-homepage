import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Shield, Clock, TrendingUp, Users } from 'lucide-react';
import LogoWithName from './LogoWithName';

const AdRedirect = ({ originalUrl, redirectDelay = 10, shortCode }) => {
  const [secondsLeft, setSecondsLeft] = useState(redirectDelay);
  const [urlInfo, setUrlInfo] = useState(null);
  const [showUrl, setShowUrl] = useState(false);
  const [stats, setStats] = useState({
    dailyClicks: '2.5K+',
    monthlyUsers: '50K+',
    totalLinks: '100K+'
  });

  useEffect(() => {
    // Fetch basic stats - replace with actual API call
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/public-stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timerId = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setShowUrl(true);
      // Attempt automatic redirect
      try {
        window.location.href = originalUrl;
      } catch (error) {
        console.error('Redirect failed:', error);
      }
    }
  }, [secondsLeft, originalUrl]);

  return (
    <>
      <Head>
        <title>Your link is almost ready - MiniFyn</title>
        <meta name="description" content="MiniFyn - The trusted URL shortening service for professionals." />
        <meta name="robots" content="noindex" />
        <link rel="preload" as="script" href="//pl24581526.profitablecpmrate.com/f48093756a685fc7ffa6b1531a3f0768/invoke.js" />
      </Head>
      <Script async="async" data-cfasync="false" src="//pl24581526.profitablecpmrate.com/f48093756a685fc7ffa6b1531a3f0768/invoke.js" />

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <LogoWithName />
            <div className="flex items-center space-x-2 bg-light-gray px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-dark-gray font-medium">
                {secondsLeft > 0 ? `${secondsLeft}s` : 'Ready!'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column: Trust indicators and stats */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-medium text-primary mb-6">
                Trusted by Professionals Worldwide
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-light-gray rounded-lg">
                  <TrendingUp className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{stats.dailyClicks}</div>
                  <div className="text-sm text-dark-gray">Daily Clicks</div>
                </div>
                <div className="text-center p-4 bg-light-gray rounded-lg">
                  <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{stats.monthlyUsers}</div>
                  <div className="text-sm text-dark-gray">Monthly Users</div>
                </div>
              </div>

              {showUrl ? (
                <div className="mt-6 p-4 bg-light-gray rounded-lg border border-medium-gray">
                  <p className="text-sm text-dark-gray mb-2">If you weren&apos;t redirected automatically, click below:</p>
                  <a 
                    href={originalUrl}
                    className="inline-flex items-center text-secondary hover:text-primary"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Go to your destination
                  </a>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="text-dark-gray text-sm">
                    Your link is being verified for security. You will be redirected automatically.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-medium text-primary mb-4">Why Choose MiniFyn?</h2>
              <ul className="space-y-3 text-dark-gray">
                <li className="flex items-center">
                  <Shield className="w-4 h-4 text-teal mr-2" />
                  Enterprise-grade security
                </li>
                <li className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-teal mr-2" />
                  Detailed analytics
                </li>
                <li className="flex items-center">
                  <Users className="w-4 h-4 text-teal mr-2" />
                  Trusted by {stats.monthlyUsers} monthly users
                </li>
              </ul>
              <button 
                onClick={() => window.location.href = '/signup'}
                className="mt-4 w-full bg-secondary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Create Your Free Account
              </button>
            </div>
          </div>

          {/* Right column: Ad space */}
          <div className="space-y-6">
            <div id="container-f48093756a685fc7ffa6b1531a3f0768"></div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdRedirect;