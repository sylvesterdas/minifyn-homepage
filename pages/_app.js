import { useState, useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';
import Navbar from '../components/Navbar';
import { isAuthenticated, getUserFromToken } from '../lib/authUtils';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = isAuthenticated();
    if (authStatus) {
      const userData = getUserFromToken();
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Component {...pageProps} user={user} setUser={setUser} />
    </>
  );
}

export default appWithTranslation(MyApp);