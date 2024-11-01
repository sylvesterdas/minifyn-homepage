import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export class PaymentService {
  static async createSubscription(userData) {
    const res = await fetch('/api/payment/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: 'plan_PFBadEYZNEmHwI',
        email: userData.email,
        name: userData.name
      })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create subscription');
    }

    return res.json();
  }

  static initializeRazorpay(options) {
    const rzp = new window.Razorpay({
      key: publicRuntimeConfig.NEXT_RAZORPAY_KEY_ID,
      ...options,
      theme: {
        color: '#3498DB',
      },
      modal: {
        confirm_close: true,
        ...options.modal
      },
      retry: {
        enabled: true,
        max_count: 3
      }
    });

    rzp.on('payment.failed', options.onPaymentFailed);
    rzp.on('payment.error', options.onPaymentError);

    return rzp;
  }

  static getPaymentConfig(userData, subscription, handlers) {
    return {
      subscription_id: subscription.id,
      name: 'MiniFyn Pro',
      description: 'Pro Plan Monthly Subscription',
      prefill: {
        name: userData.name,
        email: userData.email,
      },
      handler: handlers.onSuccess,
      modal: {
        ondismiss: handlers.onDismiss
      },
      notes: {
        email: userData.email,
        name: userData.name
      }
    };
  }
}