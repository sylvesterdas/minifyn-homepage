import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Eye, EyeOff, Check } from 'lucide-react';
import getConfig from 'next/config';
import { PLANS } from '@/constants/plans';

const { publicRuntimeConfig } = getConfig();

export default function SignupForm() {
  const { t } = useTranslation('auth');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    selectedPlan: 'free',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [razorpay, setRazorpay] = useState(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    // Load reCAPTCHA script
    const loadRecaptcha = () => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${publicRuntimeConfig.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('reCAPTCHA loaded');
        setRecaptchaLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA');
        setError(t('recaptchaError'));
      };
      document.body.appendChild(script);
    };

    loadRecaptcha();

    return () => {
      // Cleanup reCAPTCHA script
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
      if (!window.grecaptcha || !window.grecaptcha.ready) {
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

   // Separate useEffect for Razorpay loading
   useEffect(() => {
    if (formData.selectedPlan === 'pro' && !razorpayLoaded) {
      console.log('Loading Razorpay script...');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded');
        setRazorpayLoaded(true);
      };
      script.onerror = (error) => {
        console.error('Failed to load Razorpay:', error);
        setError(t('paymentError'));
        setIsLoading(false);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [formData.selectedPlan]);

  const handleSubscription = async () => {
    try {
      console.log('Creating subscription...');
      const subscriptionRes = await fetch('/api/payment/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'plan_PFBadEYZNEmHwI',
          email: formData.email,
          name: formData.fullName
        })
      });

      const subscriptionData = await subscriptionRes.json();
      if (!subscriptionRes.ok) {
        console.error('Subscription creation failed:', subscriptionData);
        throw new Error(subscriptionData.error || t('subscriptionError'));
      }

      console.log('Subscription created:', subscriptionData);
      const { subscription } = subscriptionData;

      console.log('Setting up payment options...');
      const options = {
        key: publicRuntimeConfig.NEXT_RAZORPAY_KEY_ID,
        subscription_id: subscription.id,
        name: 'MiniFyn Pro',
        description: 'Pro Plan Monthly Subscription',
        prefill: {
          name: formData.fullName,
          email: formData.email,
        },
        theme: {
          color: '#3498DB',
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setIsLoading(false);
          },
          confirm_close: true
        },
        handler: function(response) {
          console.log('Payment successful, getting fresh reCAPTCHA token...');
          
          // Get fresh reCAPTCHA token
          getRecaptchaToken()
            .then((token) => {
              console.log('Got fresh reCAPTCHA token, calling signup API...');
              return fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  // Add request ID to prevent duplicate signups
                  'X-Request-ID': `${subscription.id}-${response.razorpay_payment_id}`
                },
                body: JSON.stringify({
                  email: formData.email,
                  fullName: formData.fullName,
                  password: formData.password,
                  plan: 'pro',
                  paymentId: response.razorpay_payment_id,
                  subscriptionId: subscription.id,
                  recaptchaToken: token
                })
              });
            })
            .then(async (signupRes) => {
              const signupData = await signupRes.json();
              console.log('Signup API response:', signupData);
              
              if (!signupRes.ok) {
                throw new Error(signupData.error || t('signupError'));
              }
              
              console.log('Signup successful, redirecting...');
              window.location.href = '/dashboard';
            })
            .catch((err) => {
              console.error('Error during signup:', err);
              setError(err.message || t('signupError'));
              setIsLoading(false);
            });
        },
        notes: {
          email: formData.email,
          name: formData.fullName
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      console.log('Creating Razorpay instance...');
      const rzp = new window.Razorpay(options);

      // Add event listeners for payment flow
      rzp.on('payment.failed', function(response) {
        console.error('Payment failed:', response);
        setError(t('paymentFailed'));
        setIsLoading(false);
      });

      rzp.on('payment.error', function(error) {
        console.error('Payment error:', error);
        setError(t('paymentError'));
        setIsLoading(false);
      });

      console.log('Opening Razorpay modal...');
      rzp.open();

    } catch (err) {
      console.error('Error in handleSubscription:', err);
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
      console.log('Starting submission process...');

      if (formData.password !== formData.confirmPassword) {
        throw new Error(t('passwordMismatch'));
      }

      if (formData.selectedPlan === 'pro') {
        console.log('Initiating pro plan subscription...');
        await handleSubscription();
      } else {
        console.log('Processing free plan signup...');
        const token = await getRecaptchaToken();
        const signupRes = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            fullName: formData.fullName,
            password: formData.password,
            plan: 'free',
            recaptchaToken: token
          })
        });

        const data = await signupRes.json();
        if (!signupRes.ok) {
          throw new Error(data.error || t('signupError'));
        }

        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
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

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(PLANS).map(([planId, plan]) => (
          <div
            key={planId}
            onClick={() => setFormData(prev => ({ ...prev, selectedPlan: planId }))}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              formData.selectedPlan === planId
                ? 'border-secondary bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <p className="text-lg font-semibold">
                  {plan.price === 0 ? t('free') : `₹${plan.price}${t('monthly')}`}
                </p>
              </div>
              {formData.selectedPlan === planId && (
                <Check className="text-secondary" size={24} />
              )}
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="fullName">
            {t('fullName')}
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            {t('password')}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary pr-10"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-2 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
            {t('confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex items-start gap-2">
        <input
          id="terms"
          type="checkbox"
          checked={formData.agreeTerms}
          onChange={e => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
          className="mt-1"
          required
          disabled={isLoading}
        />
        <label className="text-sm" htmlFor="terms">
          {t('termsAgree')} <Link href="/legal/terms" className="text-secondary hover:underline">{t('termsAndConditions')}</Link>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-secondary text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isLoading 
          ? t('signingUp') 
          : formData.selectedPlan === 'pro' 
            ? t('continueToPayment') 
            : t('signupButton')
        }
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