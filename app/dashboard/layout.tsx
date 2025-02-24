"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

import { useFirebase } from "../providers/firebase-provider";

import LoadingState from "@/components/dashboard/LoadingState";

const DashboardContent = dynamic(() => import('@/components/dashboard/DashboardContent'), {
  loading: () => <LoadingState />
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isAnonymous } = useFirebase();

  useEffect(() => {
    if (!isLoading && (isAnonymous || !user)) {
      router.push("/signin");
    }
  }, [user, isLoading, isAnonymous, router]);

  if (isLoading) return <LoadingState />;
  if (!user || isAnonymous) return null;

  return <DashboardContent>{children}</DashboardContent>;
}