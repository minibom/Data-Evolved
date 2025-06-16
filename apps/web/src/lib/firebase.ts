// src/lib/firebase.ts (Firebase Admin SDK)
// This file is for server-side Firebase Admin SDK initialization and usage.
// Ensure you have service account credentials configured in your environment.
import * as admin from 'firebase-admin';

// Check if Firebase Admin is already initialized to prevent re-initialization errors
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      console.warn("Firebase Admin SDK: Missing required environment variables (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY). SDK not initialized.");
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        // databaseURL: process.env.FIREBASE_DATABASE_URL, // If using Realtime Database
      });
      console.log("Firebase Admin SDK initialized successfully.");
    }
  } catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
    // Optionally, throw the error or handle it in a way that prevents the app from starting if Firebase Admin is critical
  }
} else {
    console.log("Firebase Admin SDK already initialized.");
}

const firestoreAdmin = admin.apps.length ? admin.firestore() : null;
const authAdmin = admin.apps.length ? admin.auth() : null;
const storageAdmin = admin.apps.length ? admin.storage() : null; // If using Firebase Storage

export { firestoreAdmin, authAdmin, storageAdmin };

// Fallback for environments where Admin SDK might not be fully set up (e.g., some local dev without all env vars)
// This helps prevent crashes but logs warnings.
if (!admin.apps.length) {
  console.warn("Firebase Admin SDK is not initialized. Firestore, Auth, and Storage admin features will not be available.");
}
