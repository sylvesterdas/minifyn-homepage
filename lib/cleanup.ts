import { getDatabase } from "firebase-admin/database";

import { initAdmin } from "@/app/firebase/admin";

export async function deleteExpiredUrls() {
  initAdmin();
  const db = getDatabase();
  const now = Date.now();

  const urlsRef = db.ref("urls");

  // Query for expired URLs
  const expiredQuery = urlsRef.orderByChild("expiresAt").endAt(now);

  // Execute in batches to avoid hitting Vercel's limits
  const snapshot = await expiredQuery.get();

  if (!snapshot.exists()) {
    return { deleted: 0 };
  }

  const BATCH_SIZE = 100;
  const expiredUrls = [] as { key: string, expiresAt: number }[];

  snapshot.forEach((childSnapshot) => {
    const child = childSnapshot.val();

    if (child.expiresAt === -1 || child.expiresAt > now) {
      return;
    }

    expiredUrls.push({
      key: childSnapshot.key,
      expiresAt: child.expiresAt
    });
  });

  let deleted = 0;
  const batches = [];

  for (let i = 0; i < expiredUrls.length; i += BATCH_SIZE) {
    const batch = expiredUrls.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(url => urlsRef.child(url.key).remove());

    batches.push(Promise.all(batchPromises));
  }

  for (const batchPromise of batches) {
    const results = await batchPromise;

    deleted += results.length;
  }
  
  return { deleted };
}