"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, signInAnonymously } from "firebase/auth";

import { auth } from "../firebase/init";

const FirebaseContext = createContext<{
  user: User | null;
  isLoading: boolean;
  isAnonymous: boolean;
}>({
  user: null,
  isLoading: true,
  isAnonymous: true,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        try {
          await signInAnonymously(auth);
        } catch {
          // console.error('Anonymous auth failed:', error)
        }
      } else {
        setUser(user);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        isLoading,
        isAnonymous: user?.isAnonymous ?? true,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
