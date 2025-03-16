"use client";

import { FirebaseProvider } from "@/app/providers/firebase-provider";

export function DashboardProviders({ children }) {
  return (
    <FirebaseProvider>
      {children}
    </FirebaseProvider>
  );
}