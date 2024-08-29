import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useTranslation('auth');
  const { data: session } = useSession();

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (session) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const recaptchaToken = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'login' });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        rememberMe,
        recaptchaToken,
      });

      if (result.error) {
        setError(t('loginError'));
      } else {
        router.push('/');
      }
    } catch (error) {
      setError(t('loginError'));
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
              />
            </div>
            <div className="mb-4">
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
              />
            </div>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe" className="text-sm text-dark-gray">
                {t('rememberMe')}
              </label>
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