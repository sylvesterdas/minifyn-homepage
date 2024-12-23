import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying');
  const router = useRouter();
  const { token } = router.query;
  const { t } = useTranslation('auth');
  const { login } = useAuth();

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

  const statusMessages = {
    verifying: t('verifying_email'),
    success: t('email_verified'),
    error: t('verification_failed')
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center text-primary mb-4">
            {t('email_verification')}
          </h1>
          <p className="text-center text-dark-gray">
            {statusMessages[status]}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth', 'common'])),
    },
  };
}