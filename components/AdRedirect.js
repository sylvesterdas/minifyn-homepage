import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import LogoWithName from './LogoWithName';

const AdRedirect = ({ originalUrl, isAnonymous, redirectDelay, clicks, title, description, adClientId, adSlotId, userCountry, t }) => {
  const [secondsLeft, setSecondsLeft] = useState(redirectDelay);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timerId = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      window.location.href = originalUrl;
    }
  }, [secondsLeft, originalUrl]);

  return (
    <>
      <Head>
        <link rel="preload" as="script" href="//pl24581526.cpmrevenuegate.com/f48093756a685fc7ffa6b1531a3f0768/invoke.js" />
        <script async="async" data-cfasync="false" src="//pl24581526.cpmrevenuegate.com/f48093756a685fc7ffa6b1531a3f0768/invoke.js"></script>
      </Head>

      <nav className="bg-white shadow-sm">
        <div className="flex px-8 py-4">
          <LogoWithName />
          <div className="navbar-nav ml-auto">
            <p className="navbar-text">
              Redirecting in {secondsLeft} seconds...
            </p>
          </div>
        </div>
      </nav>

      <div className="body">
        <div id="container-f48093756a685fc7ffa6b1531a3f0768"></div>
      </div>
    </>
  );
};

export default AdRedirect;