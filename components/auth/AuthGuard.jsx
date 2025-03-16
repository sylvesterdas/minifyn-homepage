"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/app/providers/firebase-provider";
import LoadingState from "@/components/dashboard/LoadingState";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { user, isLoading, isAnonymous } = useFirebase();

  useEffect(() => {
    if (!isLoading && (isAnonymous || !user)) {
      router.push("/signin");
    }
  }, [user, isLoading, isAnonymous, router]);

  if (isLoading) return <LoadingState />;
  if (!user || isAnonymous) return null;

  return children;
}