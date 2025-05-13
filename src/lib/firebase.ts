// src/lib/firebase.ts
import { initializeApp, getApps, FirebaseApp, FirebaseError } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp | undefined = undefined;
let db: Firestore | undefined = undefined;
let initializationError: string | null = null;

try {
  // Check for missing essential configurations that are absolutely required
  const essentialKeys: (keyof typeof firebaseConfig)[] = ['apiKey', 'projectId', 'appId'];
  const missingKeys = essentialKeys.filter(key => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    // This error will be caught by the catch block below
    throw new Error(`Missing Firebase configuration key(s): ${missingKeys.join(', ')}. Please check your .env.local file or environment variables.`);
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  if (app) {
    db = getFirestore(app);
  } else {
    // This should ideally not be reached if initializeApp either succeeds or throws.
    // If it does, it means app wasn't assigned.
    throw new Error("Firebase app (initializeApp) did not return a valid instance and did not throw an error. This is unexpected.");
  }
} catch (e) {
  console.error("Firebase initialization error:", e);
  if (e instanceof FirebaseError) {
    initializationError = `Firebase Initialization Failed: ${e.code} - ${e.message}. Ensure Firebase is configured correctly, environment variables are set, and the Firebase project has Firestore enabled.`;
  } else if (e instanceof Error) {
    initializationError = `Firebase Initialization Error: ${e.message}.`;
  } else {
    initializationError = "An unknown error occurred during Firebase initialization. Check console for details.";
  }
  // app and db might be undefined or partially initialized at this point
}

export { app, db, initializationError };
