import { useState, useEffect } from 'react';
import { isAuthenticated, getUserFromToken } from '@/lib/authUtils';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStatus = isAuthenticated();
    if (authStatus) {
      const userData = getUserFromToken();
      setUser(userData);
    }
    setLoading(false);
  }, []);

  return { user, loading };
};