import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';

export default function SettingsIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/settings/account');
  }, [router]);

  return <Loading />;
}