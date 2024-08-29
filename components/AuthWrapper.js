import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AuthWrapper({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) router.push('/login'); // Redirect to login if not authenticated
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>; // You can replace this with a loading spinner
  }

  if (!session) {
    return null; // Don't render children if not authenticated
  }

  return <>{children}</>;
}