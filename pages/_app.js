import { AuthProvider } from '../contexts/AuthContext';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import PublicLayout from '../components/PublicLayout';
import DashboardLayout from '../components/DashboardLayout';
import { isAuthenticated, getUserFromToken } from '../lib/authUtils';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  const Layout = isDashboardRoute ? DashboardLayout : PublicLayout;

  return (
    <>
      <Layout user={user} setUser={setUser}>
        <Component {...pageProps} user={user} setUser={setUser} />
      </Layout>
    </>
  );
}

export default appWithTranslation(MyApp);