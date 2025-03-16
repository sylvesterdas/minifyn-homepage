import { initializeApp, getApp, getApps } from 'firebase/app';

import { firebaseConfig } from './config';

export const initFirebase = () => {
  return !getApps().length ? initializeApp(firebaseConfig) : getApp();
};