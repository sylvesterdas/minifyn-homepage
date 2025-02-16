import { kv } from "@vercel/kv";
import { User } from "firebase/auth";

export async function checkAnonymousLimit(user: User) {
  if (!user.isAnonymous) return true;

  const key = `anonymous:${user.uid}`;
  const usage = await kv.get(key) as number | null;

  if (!usage) {
    await kv.set(key, 1, { ex: 86400 }); // 24 hours

    return true;
  }

  if (usage >= 5) return false;

  await kv.incr(key);

  return true;
}

export async function checkIPLimit(ip: string) {
  const key = `ip:${ip}`;
  const usage = await kv.get(key) as number | null;

  if (!usage) {
    await kv.set(key, 1, { ex: 86400 });

    return true;
  }

  if (usage >= 10) return false;

  await kv.incr(key);

  return true;
}

export async function getRemainingLimits(user: User, ip: string) {
  const [anonUsage, ipUsage] = await Promise.all([
    kv.get(`anonymous:${user.uid}`),
    kv.get(`ip:${ip}`),
  ]) as [number | null, number | null];

  return {
    anonymous: 5 - (anonUsage || 0),
    ip: 10 - (ipUsage || 0),
  };
}

export async function checkAllLimits(user: User, ip: string) {
  const [anonAllowed, ipAllowed] = await Promise.all([
    checkAnonymousLimit(user),
    checkIPLimit(ip),
  ]);

  return anonAllowed && ipAllowed;
}
