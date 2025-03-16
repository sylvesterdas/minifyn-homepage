import { kv } from "@vercel/kv";

export async function getUserLimits(user) {
  const key = `limits:${user.uid}`;
  let limits = await kv.get(key);

  if (!limits) {
    limits = {
      dailyUrls: user.isAnonymous ? 5 : 50,
      usedToday: 0,
      resetAt: Date.now() + 86400000,
    };
    await kv.set(key, limits, { ex: 86400 });
  }

  return limits;
}

export async function incrementUrlCount(user) {
  const key = `limits:${user.uid}`;

  return kv.hincrby(key, "usedToday", 1);
}

export async function getRemainingUrls(user) {
  const limits = await getUserLimits(user);

  return limits.dailyUrls - limits.usedToday;
}
