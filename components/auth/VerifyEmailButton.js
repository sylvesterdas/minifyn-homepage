import { useState } from 'react';

export default function VerifyEmailButton() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const handleSendVerification = async () => {
    try {
      setIsDisabled(true);
      setTimeLeft(60);
      
      await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to send verification:', error);
      setIsDisabled(false);
    }
  };

  return (
    <button
      onClick={handleSendVerification}
      disabled={isDisabled}
      className={`px-4 py-2 rounded-md transition-colors ${
        isDisabled 
          ? 'bg-gray-300 cursor-not-allowed' 
          : 'bg-secondary hover:bg-primary text-white'
      }`}
    >
      {isDisabled 
        ? `Resend in ${timeLeft}s` 
        : 'Send Verification Email'}
    </button>
  );
}