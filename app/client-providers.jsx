"use client";

import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";

import { FirebaseProvider } from "@/app/providers/firebase-provider";
import AnalyticsProvider from "@/components/AnalyticsProvider";

export function ClientProviders({ children }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <FirebaseProvider>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}