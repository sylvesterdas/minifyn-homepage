import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getFirebaseCredential() {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }
  
  // Fallback to full JSON if individual fields are not set
  try {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', error);
    throw new Error('Unable to load Firebase credential');
  }
}

if (!getApps().length) {
  initializeApp({
    credential: cert(getFirebaseCredential()),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

export const db = getFirestore();