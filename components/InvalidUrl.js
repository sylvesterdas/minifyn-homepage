import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import LogoWithName from './LogoWithName';

const InvalidUrl = ({ scenario, t }) => {
  const [secondsLeft, setSecondsLeft] = useState(7);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timerId = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      window.location.href = '/';
    }
  }, [secondsLeft]);

  let message;
  switch (scenario) {
    case 'notFound':
      message = t('urlNotFound');
      break;
    case 'expired':
      message = t('urlExpired');
      break;
    case 'error':
    default:
      message = t('errorOccurred');
  }

  return (
    <>
      <Head>
        <title>Invalid URL - MiniFyn</title>
        <link rel="preload" as="script" href="//pl24581526.cpmrevenuegate.com/f48093756a685fc7ffa6b1531a3f0768/invoke.js" />
        <script async="async" data-cfasync="false" src="//pl24581526.cpmrevenuegate.com/f48093756a685fc7ffa6b1531a3f0768/invoke.js"></script>
      </Head>

      <nav className="bg-white shadow-sm">
        <div className="flex flex-wrap items-center px-8 py-4 justify-between">
          <LogoWithName />
          <div className='text-center flex-1'>
            <h1 className="text-lg font-bold mb-2 text-red-500">{t('invalidUrl')}</h1>
            <p className="text-gray-700">{message}</p>
          </div>
          <div className="navbar-nav ml-auto">
            <p className="navbar-text">
              {t('redirectingToHome', { seconds: secondsLeft })}
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

export default InvalidUrl;