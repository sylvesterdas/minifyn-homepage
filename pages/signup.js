import SignupForm from '@/components/auth/SignupForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function SignupPage() {
  const { t } = useTranslation('auth')

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          <h1 className="text-3xl font-bold text-center text-primary">
            {t('createAccount')}
          </h1>
          <SignupForm />
        </div>
      </div>
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