import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";

const options = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/
/g, "
"),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

if (!getApps().length) {
  initializeApp(options);
}

const admin = getAuth();
const db = getDatabase();

export { admin, db };