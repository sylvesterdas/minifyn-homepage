import { getDatabase } from 'firebase-admin/database';
import { Metadata } from 'next';

import { initAdmin } from '@/app/firebase/admin';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  initAdmin();
  const db = getDatabase();
  const snapshot = await db.ref(`urls/${(await params).shortCode}`).get();
  const urlData = snapshot.val();

  if (!urlData) return {};

  return {
    title: urlData.title,
    description: urlData.description
  };
}

export default function RedirectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}