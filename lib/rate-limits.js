import { db } from "@/app/firebase/admin";

const SUPER_USER_ID = process.env.SUPER_USER_ID;
const ANON_LIMIT = parseInt(process.env.ANON_LIMIT || "5", 10);
const IP_LIMIT = parseInt(process.env.IP_LIMIT || "10", 10);

export async function checkLimits(user, ip) {
  if (user && user.uid === SUPER_USER_ID) return true;

  const date = new Date().toISOString().split("T")[0];
  const ipKey = ip.replace(/\./g, "_");

  const paths = {
    anon: `limits/${date}/anonymous/${user.uid}`,
    ip: `limits/${date}/ip/${ipKey}`,
  };

  const transaction = await db.ref().transaction((currentData) => {
    const anonCount = (currentData.limits?.[date]?.anonymous?.[user.uid] || 0) + 1;
    const ipCount = (currentData.limits?.[date]?.ip?.[ipKey] || 0) + 1;

    if (user.isAnonymous && anonCount > ANON_LIMIT) return;
    if (ipCount > IP_LIMIT) return;

    if (!currentData.limits) currentData.limits = {};
    if (!currentData.limits[date]) currentData.limits[date] = {};
    if (!currentData.limits[date].anonymous) currentData.limits[date].anonymous = {};
    if (!currentData.limits[date].ip) currentData.limits[date].ip = {};

    currentData.limits[date].anonymous[user.uid] = anonCount;
    currentData.limits[date].ip[ipKey] = ipCount;

    return currentData;
  });

  return transaction.committed;
}

export async function getRemainingLimits(user, ip) {
  const date = new Date().toISOString().split("T")[0];
  const ipKey = ip.replace(/\./g, "_");

  const [anonSnap, ipSnap] = await Promise.all([
    db.ref(`limits/${date}/anonymous/${user.uid}`).get(),
    db.ref(`limits/${date}/ip/${ipKey}`).get(),
  ]);

  return {
    anonymous: ANON_LIMIT - (anonSnap.val() || 0),
    ip: IP_LIMIT - (ipSnap.val() || 0),
  };
}
