import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import PublicLayout from '../components/PublicLayout';
import DashboardLayout from '../components/DashboardLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  const Layout = isDashboardRoute ? DashboardLayout : PublicLayout;

  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);