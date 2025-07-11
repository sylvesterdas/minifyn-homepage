import { admin, db } from "@/app/firebase/admin";

export async function validateWebToken(token) {
  try {
    const decodedToken = await admin.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      isAnonymous: decodedToken.provider_id === "anonymous",
    };
  } catch (error) {
    console.error("Error validating web token:", error);
    return null;
  }
}

export async function validateApiKey(apiKey) {
  try {
    const snapshot = await db.ref(`apikeys/${apiKey}`).once("value");
    const userData = snapshot.val();
    if (!userData) return null;
    return { uid: userData.uid, isAnonymous: false };
  } catch (error) {
    console.error("Error validating API key:", error);
    return null;
  }
}

export async function authenticate(req) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const apiKey = req.headers.get("X-API-Key");

  if (apiKey) {
    return await validateApiKey(apiKey);
  }

  if (token) {
    return await validateWebToken(token);
  }

  return null;
}
