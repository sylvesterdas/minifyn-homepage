import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation('auth');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage(t('passwordResetSent'));
      } else {
        const data = await response.json();
        setError(data.message || t('passwordResetError'));
      }
    } catch (error) {
      setError(t('passwordResetError'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <header className="w-full bg-white shadow-md p-4">
        <Link href="/">
          <Image src="/favicon.ico" alt="Company Logo" width={50} height={50} style={{ width: '50px', height: '50px' }} />
        </Link>
      </header>
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-primary">{t('forgotPassword')}</h1>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-dark-gray mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              {t('resetPasswordButton')}
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-secondary hover:underline">
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth', 'common'])),
    },
  };
}