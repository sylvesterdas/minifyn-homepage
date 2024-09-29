import React, { useState, useEffect } from 'react';

const AdConsent = ({ onConsent, userCountry }) => {
  const [hasConsented, setHasConsented] = useState(false);

  const requiresConsent = ['US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'IE', 'DK', 'FI', 'NO', 'SE', 'AT', 'CH', 'PL'];

  useEffect(() => {
    if (!requiresConsent.includes(userCountry)) {
      setHasConsented(true);
      onConsent(true);
    } else {
      const storedConsent = localStorage.getItem('adConsent');
      if (storedConsent) {
        setHasConsented(true);
        onConsent(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onConsent, userCountry]);

  const handleConsent = (consent) => {
    setHasConsented(consent);
    localStorage.setItem('adConsent', consent);
    onConsent(consent);
  };

  if (hasConsented || !requiresConsent.includes(userCountry)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 shadow-md">
      <p className="mb-2">We use cookies to personalize content and ads, provide social media features, and analyze our traffic.</p>
      <div className="flex justify-end space-x-4">
        <button onClick={() => handleConsent(false)} className="px-4 py-2 bg-gray-300 rounded">
          Reject
        </button>
        <button onClick={() => handleConsent(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
          Accept
        </button>
      </div>
    </div>
  );
};

export default AdConsent;