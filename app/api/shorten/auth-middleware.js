import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

export async function validateWebToken(token) {
  const decodedToken = await getAuth().verifyIdToken(token);

  return {
    uid: decodedToken.uid,
    isAnonymous: decodedToken.provider_id === "anonymous",
  };
}

export async function validateApiKey(apiKey) {
  const db = getDatabase();
  const snapshot = await db
    .ref(`apikeys/${apiKey}`)
    .once("value");

  const userData = snapshot.val();

  if (!userData) return null;

  const userId = userData.uid;

  return { uid: userId, isAnonymous: false };
}

export async function authenticate(req) {
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
