import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import getConfig from 'next/config';
import SignupFields from './SignupFields';

const { publicRuntimeConfig } = getConfig();

export default function SignupForm() {
  const { t } = useTranslation('auth');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${publicRuntimeConfig.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaLoaded(true);
    script.onerror = () => setError(t('recaptchaError'));
    document.body.appendChild(script);

    return () => {
      const script = document.querySelector(
        `script[src^="https://www.google.com/recaptcha/api.js"]`
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [t]);

  const getRecaptchaToken = () => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha?.ready) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(publicRuntimeConfig.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'signup' })
          .then(resolve)
          .catch(reject);
      });
    });
  };

  const handleSignup = async (token) => {
    try {
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
          recaptchaToken: token
        })
      });

      const data = await signupRes.json();
      if (!signupRes.ok) {
        throw new Error(data.error || t('signupError'));
      }

      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      setError('');
      setIsLoading(true);

      if (formData.password !== formData.confirmPassword) {
        throw new Error(t('passwordMismatch'));
      }

      if (!recaptchaLoaded) {
        throw new Error(t('recaptchaNotLoaded'));
      }

      const token = await getRecaptchaToken();
      await handleSignup(token);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <SignupFields
        formData={formData}
        setFormData={setFormData}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        isLoading={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading || !recaptchaLoaded}
        className="w-full bg-secondary text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isLoading ? t('signingUp') : t('signupButton')}
      </button>

      <p className="text-sm text-center">
        {t('alreadyHaveAccount')}{' '}
        <Link href="/login" className="text-secondary hover:underline">
          {t('login')}
        </Link>
      </p>
    </form>
  );
}