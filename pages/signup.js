import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function PasswordStrengthMeter({ password }) {
  const { t } = useTranslation('auth');
  const [strength, setStrength] = useState('');

  useEffect(() => {
    const calculateStrength = (pwd) => {
      if (pwd.length < 8) return 'weak';
      if (pwd.length >= 12 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) return 'strong';
      return 'medium';
    };

    setStrength(calculateStrength(password));
  }, [password]);

  return (
    <div className="mt-2">
      <p className="text-sm">{t('passwordStrength')}: <span className={`font-bold ${strength === 'weak' ? 'text-red-500' : strength === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>{t(strength)}</span></p>
    </div>
  );
}

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    if (!agreeTerms) {
      setError(t('agreeTermsRequired'));
      return;
    }

    try {
      const recaptchaToken = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'signup' });

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });

      if (response.ok) {
        setConfirmationSent(true);
      } else {
        const data = await response.json();
        setError(data.message || t('signupError'));
      }
    } catch (error) {
      console.error(error)
      setError(t('signupError'));
    }
  };

  if (confirmationSent) {
    return (
      <div className="min-h-screen flex flex-col bg-light-gray">
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
            <h2 className="text-2xl font-bold mb-4 text-primary">{t('confirmationSent')}</h2>
            <p className="mb-4">{t('confirmationInstructions')}</p>
            <Link href="/login" className="text-secondary hover:underline">
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-primary">{t('signup')}</h1>
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
              autoComplete="new-password"
            />
            <PasswordStrengthMeter password={password} />
          </div>
          <div className="mb-6">
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
              autoComplete="new-password"
            />
          </div>
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              className="mr-2"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
            />
            <label htmlFor="agreeTerms" className="text-sm text-dark-gray">
              {t('termsAgree')} <Link href="/terms" className="text-secondary hover:underline">{t('termsAndConditions')}</Link>
            </label>
          </div>
          <button
              type="submit"
              className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              {t('signupButton')}
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            {t('alreadyHaveAccount')} {' '}
            <Link href="/login" className="text-secondary hover:underline">
              {t('login')}
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