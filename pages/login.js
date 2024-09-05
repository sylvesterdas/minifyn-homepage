import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useTranslation('auth');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        router.push('/');
      } else {
        setError(data.message || t('loginError'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('loginError'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-primary">{t('login')}</h1>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
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
                autoComplete="username"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-dark-gray mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              {t('loginButton')}
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/forgot-password" className="text-secondary hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            {t('dontHaveAccount')} {' '}
            <Link href="/signup" className="text-secondary hover:underline">
              {t('signup')}
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
