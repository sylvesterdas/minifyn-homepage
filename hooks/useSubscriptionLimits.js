import useSWR from 'swr';
import { useAuth } from '@/contexts/AuthContext';

export const useSubscriptionLimits = () => {
  const { user } = useAuth();
  
  const { data, error } = useSWR(
    user ? '/api/dashboard/subscription-limits' : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch subscription limits');
      return res.json();
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute
    }
  );

  return {
    limits: data,
    isLoading: !error && !data,
    isError: error
  };
};