import { getRazorpayPlanId } from "@/constants/plans";

export class PaymentService {
  static loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  }

  static async createSubscription(userData) {
    const res = await fetch('/api/payment/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: getRazorpayPlanId('pro', 'monthly'),
        email: userData.email,
        name: userData.name,
        customerId: userData.id
      })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create subscription');
    }

    return res.json();
  }

  static initializeRazorpay(options, razorpayKey) {
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }

    const rzp = new window.Razorpay({
      key: razorpayKey,
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
      },
      // Limit payment methods to those supporting recurring payments
      "method": {
        "netbanking": false,
        "wallet": false,
        "upi": false,
        "paylater": false,
        "card": true,
        "emi": false
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
        customer_id: userData.id,
        email: userData.email,
        name: userData.name
      }
    };
  }

  static async handleSubscription(userData, razorpayKey, onSuccess, onDismiss, onError) {
    try {
      await this.loadRazorpayScript();
      
      // Create subscription with user ID
      const subscription = await this.createSubscription({
        ...userData,
        id: userData.id
      });
      
      const handlers = {
        onSuccess: (response) => {
          onSuccess({
            subscription,
            payment: response
          });
        },
        onDismiss: () => {
          onDismiss();
        },
        onPaymentFailed: () => {
          onError();
        },
        onPaymentError: () => {
          onError();
        }
      };

      console.log('subscription', subscription)

      const paymentConfig = this.getPaymentConfig({ ...userData, id: userData.id }, subscription, handlers);
      const razorpay = this.initializeRazorpay(paymentConfig, razorpayKey);
      razorpay.open();
    } catch (error) {
      onError();
      console.error('Subscription creation failed:', error);
    }
  }
}