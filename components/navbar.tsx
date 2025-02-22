'use client';

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { Image } from "@heroui/image";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";

import { SignOut } from "@/components/auth/SignOut";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useFirebase } from "@/app/providers/firebase-provider";

const NavBrand = () => (
  <NavbarBrand as="li" className="gap-3 max-w-fit">
    <NextLink className="flex justify-start items-center gap-2" href="/">
      <Image
        priority
        alt="logo"
        as={NextImage}
        height={35}
        quality={100}
        shadow="sm"
        src="/logo.png"
        width={35}
      />
      <p className="font-bold text-foreground">MiniFyn</p>
    </NextLink>
  </NavbarBrand>
);

const AuthButtons = () => {
  const { user, isAnonymous } = useFirebase();

  if (user && !isAnonymous) {
    return (
      <div className="flex items-center gap-2">
        <Button
          as={Link}
          href="/dashboard"
          variant="primary"
        >
          Dashboard
        </Button>
        <SignOut />
      </div>
    );
  }

  return (
    <Button
      as={Link}
      href="/signin"
      variant="primary"
    >
      Get Started
    </Button>
  );
};

const DesktopNav = ({ path }: any) => (
  <NavbarContent
    className="hidden md:flex basis-1/5 md:basis-full"
    justify="end"
  >
    {siteConfig.navMenuItems.map((item) => (
      <NavbarItem key={item.href}>
        <Link
          color={path === item.href ? "primary" : "foreground"}
          href={item.href}
          size="md"
        >
          {item.label}
        </Link>
      </NavbarItem>
    ))}
    <NavbarItem>
      <AuthButtons />
    </NavbarItem>
  </NavbarContent>
);

const MobileNav = ({ path, onClose }: { path: string|null, onClose: () => void }) => {
  const { user } = useFirebase();

  return (
    <>
      <NavbarContent className="md:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="bg-gradient-to-b from-background to-background/50 backdrop-blur-xl">
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item) => (
            <NavbarMenuItem key={item.href}>
              <Link
                color={path === item.href ? "primary" : "foreground"}
                href={item.href}
                size="lg"
                onPress={onClose}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <Button
              as={Link}
              className="w-full"
              href={user ? "/dashboard" : "/signin"}
              variant="primary"
              onPress={onClose}
            >
              {user ? "Dashboard" : "Get Started"}
            </Button>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </>
  );
};

export const Navbar = () => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <HeroUINavbar
      className="z-50 border-small border-default-100 bg-gradient-to-b from-background to-background/50 backdrop-blur-xl"
      isMenuOpen={isOpen}
      maxWidth="full"
      position="sticky"
      onMenuOpenChange={setIsOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start" >
        <NavBrand />
      </NavbarContent>

      <DesktopNav path={path} />
      <MobileNav path={path} onClose={handleClose} />
    </HeroUINavbar>
  );
}