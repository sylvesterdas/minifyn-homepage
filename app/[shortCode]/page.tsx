import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDatabase } from "firebase-admin/database";

import { RedirectClient } from "@/app/[shortCode]/redirect-client";
import { initAdmin } from "@/app/firebase/admin";

export const dynamic = "force-dynamic";

interface SEOData {
  title: string;
  description: string;
  canonical: string;
  ogUrl: string;
  ogType: string;
  ogTitle: string;
  ogImage: string;
  ogDescription: string;
  twitterCard: string;
  twitterImage: string;
  twitterTitle: string;
  twitterDescription: string;
}

const getUrlData = cache(async (shortCode: string) => {
  initAdmin();
  const db = getDatabase();
  const snapshot = await db.ref(`urls/${shortCode}`).get();

  return snapshot.val();
});

export async function generateMetadata({
  params,
}: {
  params: { shortCode: string };
}): Promise<Metadata> {
  const shortCode = (await params).shortCode;
  const urlData = await getUrlData(shortCode);

  if (!urlData || !urlData.seo) {
    return {};
  }

  const seo = urlData.seo as SEOData;

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
      card: seo.twitterCard as
        | "summary"
        | "summary_large_image"
        | "app"
        | "player",
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

export default async function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const shortCode = (await params).shortCode;
  const urlData = await getUrlData(shortCode);

  if (!urlData) {
    notFound();
  }

  return <RedirectClient urlData={urlData} />;
}