import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from 'next-themes';
import PublicLayout from '@/components/PublicLayout';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  const Layout = isDashboardRoute ? DashboardLayout : PublicLayout;

  const body = (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
      {router.route !== '/[shortCode]' ? (
        <AuthProvider>{body}</AuthProvider>
      ) : (
        body
      )}
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp);