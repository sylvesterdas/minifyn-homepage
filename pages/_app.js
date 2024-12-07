import Script from 'next/script';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
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
        <Script
          id="osano-script"
          src="https://cmp.osano.com/AzZf9zUWGEOX8IkzM/de7b4016-6d72-4699-8703-ac98f261c04f/osano.js"
          strategy="beforeInteractive"
        />
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