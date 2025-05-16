// src/lib/firebase.ts
import { initializeApp, getApps, FirebaseApp, FirebaseError } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Log environment variables to help diagnose initialization issues
console.log("Firebase Service Initializing. Reading environment variables:");
console.log(`NEXT_PUBLIC_FIREBASE_API_KEY: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`);
console.log(`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`);
console.log(`NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
console.log(`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`);
console.log(`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`);
console.log(`NEXT_PUBLIC_FIREBASE_APP_ID: ${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}`);
console.log(`NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (Optional): ${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional, ensure it's handled if undefined
};

let app: FirebaseApp | undefined = undefined;
let db: Firestore | undefined = undefined;
let initializationError: string | null = null;

try {
  // Check for missing essential configurations that are absolutely required
  const essentialKeys: (keyof typeof firebaseConfig)[] = ['apiKey', 'projectId', 'appId'];
  const missingKeys = essentialKeys.filter(key => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    const errorMessage = `Missing Firebase configuration key(s): ${missingKeys.join(', ')}. Please check your environment variables. Values logged above.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully.");
  } else {
    app = getApps()[0];
    console.log("Using existing Firebase app instance.");
  }

  if (app) {
    db = getFirestore(app);
    console.log("Firestore instance obtained successfully.");
  } else {
    // This should ideally not be reached if initializeApp either succeeds or throws.
    const appInstanceErrorMessage = "Firebase app (initializeApp) did not return a valid instance and did not throw an error. This is unexpected.";
    console.error(appInstanceErrorMessage);
    throw new Error(appInstanceErrorMessage);
  }
} catch (e) {
  console.error("Detailed Firebase initialization error catch block:", e);
  if (e instanceof FirebaseError) {
    initializationError = `Firebase Initialization Failed: ${e.code} - ${e.message}. Ensure Firebase is configured correctly, environment variables are set (check logs above), and the Firebase project has Firestore enabled.`;
  } else if (e instanceof Error) {
    // This will now include the specific missing keys message if that was the cause
    initializationError = e.message;
  } else {
    initializationError = "An unknown error occurred during Firebase initialization. Check server console for details.";
  }
  console.error(`Final initializationError state: ${initializationError}`);
  // app and db might be undefined or partially initialized at this point
}

export { app, db, initializationError };
