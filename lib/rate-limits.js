import { getDatabase } from "firebase-admin/database";

import { initAdmin } from "@/app/firebase/admin";

export async function checkLimits(user, ip) {
  if (!user.isAnonymous && user.uid === process.env.SUPER_USER_ID) return true;

  initAdmin();
  const db = getDatabase();
  const date = new Date().toISOString().split("T")[0];

  const paths = {
    anon: `limits/${date}/anonymous/${user.uid}`,
    ip: `limits/${date}/ip/${ip.replace(/\./g, "_")}`,
  };

  const [anonSnap, ipSnap] = await Promise.all([
    db.ref(paths.anon).get(),
    db.ref(paths.ip).get(),
  ]);

  const count = {
    anon: anonSnap.val() || 0,
    ip: ipSnap.val() || 0,
  };

  if (user.isAnonymous && count.anon >= 5) return false;
  if (count.ip >= 10) return false;

  await Promise.all([
    db.ref(paths.anon).set(count.anon + 1),
    db.ref(paths.ip).set(count.ip + 1),
  ]);

  return true;
}

export async function getRemainingLimits( user, ip ) {
  initAdmin();
  const db = getDatabase();
  const date = new Date().toISOString().split("T")[0];

  const [anonCount, ipCount] = await Promise.all([
    db.ref(`limits/${date}/anonymous/${user.uid}`).get(),
    db.ref(`limits/${date}/ip/${ip.replace(/\./g, "_")}`).get(),
  ]);

  return {
    anonymous: 5 - (anonCount.val() || 0),
    ip: 10 - (ipCount.val() || 0),
  };
}
