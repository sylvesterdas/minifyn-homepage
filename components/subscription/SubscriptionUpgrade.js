import { useState } from 'react';
import { PLANS } from '@/constants/plans';
import { Check, AlertCircle } from 'lucide-react';
import { PaymentService } from '@/lib/services/paymentService';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function SubscriptionUpgrade({ 
  onSuccess, 
  currentPlan = 'free', 
  user, 
  subscriptionId,
  isFromSignup = false 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');

      const userData = {
        email: user.email,
        name: user.full_name,
        id: user.id
      };

      await PaymentService.handleSubscription(
        userData,
        publicRuntimeConfig.NEXT_RAZORPAY_KEY_ID,
        async (subscriptionData) => {
          try {
            const res = await fetch('/api/payment/success', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: subscriptionData.payment.razorpay_payment_id,
                subscriptionId: subscriptionData.subscription.subscription.id,
                planId: 'pro'
              })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Payment processing failed');

            setSuccessMessage('Successfully upgraded to Pro plan!');
            onSuccess?.(data.subscription);
          } catch (err) {
            setError('Failed to process payment. Please contact support.');
          } finally {
            setIsLoading(false);
          }
        },
        () => {
          setIsLoading(false);
          setError('Payment cancelled. No charges have been made.');
        },
        () => {
          setError('Payment failed. Please try again.');
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.error('Upgrade error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscriptionId) {
      setError('No active subscription found');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');

      const res = await fetch('/api/payment/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      setSuccessMessage(data.message);
      onSuccess?.({ ...user, planId: 'free' });
    } catch (err) {
      console.error('Cancel subscription error:', err);
      setError(err.message || 'Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const showProPlan = currentPlan === 'free';
  const proPlan = PLANS.pro;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
          {successMessage}
        </div>
      )}

      {showProPlan ? (
        <div className="p-6 rounded-lg border-2 border-gray-200 hover:border-secondary transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-primary">{proPlan.displayName}</h3>
              <p className="text-2xl font-semibold text-secondary">₹{proPlan.price}/mo</p>
              <p className="text-sm text-gray-500">or ₹{proPlan.yearlyPrice}/year (save 15%)</p>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {proPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-600">
                <Check size={18} className="text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-secondary text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Processing...' : isFromSignup ? 'Complete Pro Subscription' : 'Upgrade Now'}
          </button>
          
          <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
            <AlertCircle size={16} />
            Only credit/debit cards are accepted for recurring payments
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-lg border-2 border-gray-200">
          <h3 className="text-xl font-bold text-primary mb-4">Cancel Subscription</h3>
          <p className="text-gray-600 mb-6">
            Your subscription will remain active until the end of the current billing period. 
            After that, you&apos;ll be moved to the free plan with limited features.
          </p>
          
          <button
            onClick={handleCancelSubscription}
            disabled={isLoading || !subscriptionId}
            className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Processing...' : 'Cancel Subscription'}
          </button>
        </div>
      )}
    </div>
  );
}