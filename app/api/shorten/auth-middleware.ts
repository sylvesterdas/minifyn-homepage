import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { User } from "firebase/auth";

export async function validateWebToken(token: string) {
  const decodedToken = await getAuth().verifyIdToken(token);

  return {
    uid: decodedToken.uid,
    isAnonymous: decodedToken.provider_id === "anonymous",
  } as User;
}

export async function validateApiKey(apiKey: string) {
  const db = getDatabase();
  const snapshot = await db
    .ref(`apikeys/${apiKey}`)
    .once("value");

  const userData = snapshot.val();

  if (!userData) return null;

  const userId = userData.uid;

  return { uid: userId, isAnonymous: false } as User;
}

export async function authenticate(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const apiKey = req.headers.get("X-API-Key");

  try {
    if (apiKey) return await validateApiKey(apiKey);
    if (token) return await validateWebToken(token);

    return null;
  } catch {
    return null;
  }
}
