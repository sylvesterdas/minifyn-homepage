import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import PublicLayout from '@/components/PublicLayout';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import ConsentManager from '@/components/ConsentManager';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  const Layout = isDashboardRoute ? DashboardLayout : PublicLayout;

  const body = (
      <Layout>
        <ConsentManager />
        <Component {...pageProps} />
      </Layout>
  )

  if (router.route !== '/[shortCode]')
    return (
      <AuthProvider>
        {body}
      </AuthProvider>
    );
  else {
    return body;
  }
}

export default appWithTranslation(MyApp);