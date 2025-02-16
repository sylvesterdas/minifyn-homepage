import { getDatabase } from 'firebase-admin/database';
import { notFound } from 'next/navigation';

import { RedirectClient } from '@/app/[shortCode]/redirect-client';
import { initAdmin } from '@/app/firebase/admin';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }: any) {
  initAdmin();
  const db = getDatabase();
  const snapshot = await db.ref(`urls/${(await params).shortCode}`).get();
  const urlData = snapshot.val();

  if (!urlData) {
    notFound();
  }

  return <RedirectClient urlData={urlData} />;
}