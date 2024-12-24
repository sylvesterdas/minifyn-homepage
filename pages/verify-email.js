import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '@/components/SEO';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying');
  const router = useRouter();
  const { token } = router.query;
  const { t } = useTranslation('auth');

  useEffect(() => {
    if (!token) return;

    async function verifyEmail() {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        if (res.ok) {
          setStatus('success');
          setTimeout(() => router.push('/dashboard'), 3000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    }

    verifyEmail();
  }, [token, router]);

  const statusConfig = {
    verifying: {
      icon: <Loader2 className="h-12 w-12 text-secondary animate-spin" />,
      message: t('verifying_email'),
      className: 'text-secondary'
    },
    success: {
      icon: <CheckCircle2 className="h-12 w-12 text-teal" />,
      message: t('email_verified'),
      className: 'text-teal'
    },
    error: {
      icon: <XCircle className="h-12 w-12 text-coral" />,
      message: t('verification_failed'),
      className: 'text-coral'
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <>
      <SEO title={t('email_verification')} />
      <div className="min-h-screen flex bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full">
          <Card className="bg-white shadow-md">
            <CardContent className="p-8 flex flex-col items-center space-y-4">
              {currentStatus.icon}
              <h1 className="text-2xl font-bold text-primary">
                {t('email_verification')}
              </h1>
              <p className={`text-center ${currentStatus.className}`}>
                {currentStatus.message}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth', 'common'])),
    },
  };
}