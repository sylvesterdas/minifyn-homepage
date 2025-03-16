"use client";

import { Suspense, lazy } from "react";
import { FirebaseProvider } from "@/app/providers/firebase-provider";
import LoadingState from "@/components/dashboard/LoadingState";

// Lazy load authentication
const AuthGuard = lazy(() => import('@/components/auth/AuthGuard'));
const DashboardShell = lazy(() => import('@/components/dashboard/DashboardShell'));

export default function DashboardLayout({ children }) {
  return (
    <FirebaseProvider>
      <Suspense fallback={<LoadingState />}>
        <AuthGuard>
          <Suspense fallback={<LoadingState />}>
            <DashboardShell>{children}</DashboardShell>
          </Suspense>
        </AuthGuard>
      </Suspense>
    </FirebaseProvider>
  );
}