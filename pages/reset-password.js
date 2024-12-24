import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '@/components/SEO';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();
  const { t } = useTranslation('auth');

  useEffect(() => {
      // Load reCAPTCHA script
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      document.body.appendChild(script);
  
      return () => {
        document.body.removeChild(script);
      };
    }, []);

  useEffect(() => {
    if (router.isReady) {
      setToken(router.query.token || '');
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
  
    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }
  
    try {
      let recaptchaToken;
      try {
        recaptchaToken = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action: 'reset_password' }
        );
      } catch (error) {
        console.error('reCAPTCHA error:', error);
        setError('Verification failed. Please try again.');
        return;
      }
  
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, recaptchaToken }),
      });
  
      const data = await response.json();
      console.log('Reset response:', data); // Debug log
  
      if (response.ok) {
        setMessage(t('passwordResetSuccess'));
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.error || t('passwordResetError'));
      }
    } catch (error) {
      console.error('Reset error:', error);
      setError(t('passwordResetError'));
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-500">{t('invalidResetLink')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={t('resetPassword')} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-primary">
            {t('resetPassword')}
          </h1>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-gray mb-2">
                {t('newPassword')}
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-gray mb-2">
                {t('confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 border border-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              {t('updatePassword')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth', 'common'])),
    },
  };
}