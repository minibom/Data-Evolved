// src/lib/firebaseClient.ts (Firebase JS SDK)
// This file is for client-side Firebase JS SDK initialization.
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth'; // No longer need persistence types here, managed in AuthContext
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage'; // If using Firebase Storage
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
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
// let analytics; // Define if used

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    // analytics = typeof window !== 'undefined' ? getAnalytics(app) : undefined;
    console.log("Firebase JS SDK initialized successfully.");
  } catch (error) {
    console.error("Firebase JS SDK initialization error:", error);
    // Fallback or re-throw if Firebase is critical for the app to function
    // For now, we'll let it be, but auth, db, storage will be undefined
  }
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  // analytics = typeof window !== 'undefined' ? getAnalytics(app) : undefined;
  console.log("Firebase JS SDK already initialized.");
}

export { app, auth, db, storage /*, analytics */ };
