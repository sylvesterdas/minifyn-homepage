import { cache, lazy } from "react";
import { notFound } from "next/navigation";
import { getDatabase } from "firebase-admin/database";

import { initAdmin } from "@/app/firebase/admin";

export const dynamic = "force-dynamic";
const RedirectClient = lazy(() => import("@/app/[shortCode]/redirect-client"));

const getUrlData = cache(async (shortCode) => {
  initAdmin();
  const db = getDatabase();
  const snapshot = await db.ref(`urls/${shortCode}`).get();

  return snapshot.val();
});

export async function generateMetadata({ params }) {
  const shortCode = (await params).shortCode;
  const urlData = await getUrlData(shortCode);

  if (!urlData || !urlData.seo) {
    return {};
  }

  const seo = urlData.seo;

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.ogDescription,
      url: seo.canonical,
      type: "article",
      siteName: "MiniFyn",
      locale: "en_US",
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: seo.twitterCard,
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: seo.twitterImage ? [seo.twitterImage] : undefined,
    },
    alternates: {
      canonical: seo.canonical,
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:type": "image/png",
    },
  };
}

export default async function RedirectPage({ params }) {
  const shortCode = (await params).shortCode;
  const urlData = await getUrlData(shortCode);

  if (!urlData) {
    notFound();
  }

  return <RedirectClient urlData={urlData} />;
}