// src/lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// It's crucial to use environment variables for Firebase config for security.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;
let db: Firestore;

if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
} else if (typeof window !== 'undefined') {
  app = getApps()[0];
} else {
  // Handle server-side initialization if needed, though Firestore client SDK primarily runs on client
  // For server actions, direct admin SDK might be used or ensure client SDK can init.
  // For this use case, we primarily expect client-side action for onBlur.
  // If server action needs db, it should use Admin SDK or ensure app is initialized.
  // Let's assume for now that actions are invoked in a context where app can be initialized.
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
}

// @ts-ignore
db = getFirestore(app);

export { app, db };
