import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (credentials) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    setLoading(true);
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    setLoading(false);
    if (res.ok) {
      setUser(null);
    } else {
      throw new Error('Logout failed');
    }
  };

  // Use useMemo to memoize the context value
  const contextValue = useMemo(() => ({
    user,
    setUser,
    login,
    logout,
    loading
  }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);