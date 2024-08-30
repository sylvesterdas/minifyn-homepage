import Link from 'next/link';
import React from 'react';

const InvalidUrl = ({ scenario, t }) => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-red-500">{t('invalidUrl')}</h1>
        <p className="text-gray-700">{message}</p>
        <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default InvalidUrl;