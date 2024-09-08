import { useState, useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import PublicLayout from '../components/PublicLayout';
import DashboardLayout from '../components/DashboardLayout';
import Loading from '../components/Loading';
import { isAuthenticated, getUserFromToken } from '../lib/authUtils';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const authStatus = isAuthenticated();
    if (authStatus) {
      const userData = getUserFromToken();
      setUser(userData);
    }
  }, []);

  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  const Layout = isDashboardRoute ? DashboardLayout : PublicLayout;

  return (
    <Layout user={user} setUser={setUser}>
      <Component {...pageProps} user={user} setUser={setUser} />
    </Layout>
  );
}

export default appWithTranslation(MyApp);