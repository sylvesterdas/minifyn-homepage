import { useState, useEffect } from 'react';
import { PLANS } from '@/constants/plans';
import { Check } from 'lucide-react';

export default function SubscriptionUpgrade({ onSuccess, currentPlan = 'free', isSignup = false, user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => setError('Failed to load payment system');
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePaymentSuccess = async (response) => {
    try {
      const res = await fetch('/api/payment/success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: response.razorpay_payment_id,
          subscriptionId: response.razorpay_subscription_id
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment processing failed');

      // Call onSuccess with the updated subscription data
      onSuccess?.(data.subscription);
    } catch (err) {
      console.error('Payment success handling failed:', err);
      setError('Failed to process payment. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      setIsLoading(true);
      setError('');

      // Create subscription
      const subscriptionRes = await fetch('/api/payment/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId
        })
      });

      if (!subscriptionRes.ok) {
        throw new Error('Failed to create subscription');
      }

      const { subscription } = await subscriptionRes.json();

      // Initialize Razorpay
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscription.id,
        name: 'MiniFyn Pro',
        description: 'Pro Plan Monthly Subscription',
        theme: {
          color: '#3498DB',
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        notes: {
          user_id: user.id
        },
        modal: {
          ondismiss: () => setIsLoading(false)
        },
        handler: handlePaymentSuccess
      });

      rzp.open();
    } catch (err) {
      console.error('Upgrade error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Show only relevant plans based on current plan
  const availablePlans = Object.entries(PLANS).filter(([planId]) => {
    if (isSignup) return true;
    return planId !== currentPlan && (
      currentPlan === 'free' ? planId === 'pro' : planId === 'free'
    );
  });

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availablePlans.map(([planId, plan]) => (
          <div
            key={planId}
            className="p-6 rounded-lg border-2 border-gray-200 hover:border-secondary transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary">{plan.name}</h3>
                <p className="text-2xl font-semibold text-secondary">
                  {plan.price === 0 ? 'Free' : `₹${plan.price}/mo`}
                </p>
              </div>
              {currentPlan === planId && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Current Plan
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <Check size={18} className="text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {planId !== currentPlan && (
              <button
                onClick={() => handleUpgrade({
                  email: user?.email, // Get from auth context
                  name: user?.fullName // Get from auth context
                })}
                disabled={isLoading || !razorpayLoaded || planId === currentPlan}
                className="w-full py-2 px-4 bg-secondary text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Processing...' : planId === 'free' ? 'Downgrade' : 'Upgrade Now'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}