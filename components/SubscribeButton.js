import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SubscribeButton({ plan }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plan.price,
          productInfo: plan.name,
          firstName: 'User', // You'll need to get this from the user's profile
          email: 'user@example.com', // You'll need to get this from the user's profile
          phone: '9999999999', // You'll need to get this from the user's profile
        }),
      });
      const data = await response.json();
      // Redirect to PayU payment page
      router.push(data.paymentUrl);
    } catch (error) {
      console.error('Error creating payment:', error);
      // Handle error (show error message to user)
    }
    setIsLoading(false);
  };

  return (
    <button onClick={handleSubscribe} disabled={isLoading}>
      {isLoading ? 'Processing...' : `Subscribe to ${plan.name}`}
    </button>
  );
}