import { useState, useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';
import Navbar from '../components/Navbar';
import { isAuthenticated } from '../lib/authUtils';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status when the component mounts
    const authStatus = isAuthenticated();
    if (authStatus) {
      // If authenticated, set the user state
      // You might want to fetch user details from an API here
      setUser({ id: 'user-id', email: 'user@example.com' });
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Component {...pageProps} user={user} setUser={setUser} />
    </>
  );
}

export default appWithTranslation(MyApp);