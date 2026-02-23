import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!
};

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Missing Firebase configuration. Please check your .env.local file.');
  throw new Error('Firebase configuration error');
}

// Initialize Firebase core services (safe to import on server)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

let _analyticsInstance: any = null;

// Dynamically load Firebase Analytics on-demand (consent or interaction)
export async function loadAnalytics() {
  if (typeof window === 'undefined') return null;
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) return null;
  if (_analyticsInstance) return _analyticsInstance;

  try {
    const analyticsModule = await import('firebase/analytics');
    const { isSupported, getAnalytics } = analyticsModule as any;

    if (typeof isSupported === 'function') {
      const supported = await isSupported();
      if (!supported) return null;
    }

    _analyticsInstance = getAnalytics(app);
    return _analyticsInstance;
  } catch (err) {
    console.warn('Failed to load Firebase Analytics', err);
    return null;
  }
}

export { app, auth, db };
