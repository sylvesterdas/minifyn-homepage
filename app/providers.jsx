"use client";

import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { FirebaseProvider } from "@/app/providers/firebase-provider";

export function Providers({ children, themeProps }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
