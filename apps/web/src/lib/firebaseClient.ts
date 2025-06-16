// src/lib/firebaseClient.ts (Firebase JS SDK)
// This file is for client-side Firebase JS SDK initialization.
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, browserSessionPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // If using Firebase Storage
// import { getAnalytics } from "firebase/analytics"; // If using Firebase Analytics

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase JS SDK initialized successfully.");
} else {
  app = getApp();
  console.log("Firebase JS SDK already initialized.");
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : undefined;


// Configure auth persistence
// Default is 'local' (persists across browser sessions)
// Use 'session' for persistence only during the current session
// Use 'none' for no persistence (in-memory only)
// Example of setting to session persistence:
// setPersistence(auth, browserSessionPersistence)
//   .then(() => {
//     console.log("Firebase Auth persistence set to session.");
//   })
//   .catch((error) => {
//     console.error("Error setting Firebase Auth persistence:", error);
//   });


export { app };
