export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "MiniFyn - Quick Links & QR Codes for Devs",
  description: "Free URL shortener & QR generator for developers. Perfect for side projects, API testing, and small businesses. Try MiniFyn now!",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    // },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    // },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  links: {
    shortenApi: "https://minifyn.com/api/shorten",
    github: "https://github.com/Minifyn/minifyn-issues/issues/new/choose",
    twitter: "https://x.com/minifyncom",
    docs: "https://minifyn.com/api/docs",
    discord: "#",
    sponsor: "#",
  },
};
