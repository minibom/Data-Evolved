// src/lib/db/firestore.ts
/**
 * This module provides utility functions for interacting with Firestore.
 * It aims to centralize Firestore access logic, making it easier to manage
 * data operations and ensure consistency.
 */

import { firestoreAdmin } from '../firebase'; // For server-side
// For client-side, you'd import from firebaseClient and use client SDK methods directly where needed, or through APIs.
// import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
// import { db as firestoreClient } from '../firebaseClient';

// ----- SERVER-SIDE EXAMPLES (using Admin SDK) -----

/**
 * Gets a document from a specified collection.
 * To be used on the server-side (API Routes, Genkit flows).
 */
export async function getDocument<T>(collectionPath: string, documentId: string): Promise<T | null> {
  if (!firestoreAdmin) {
    console.warn(`Firestore (Admin): SDK not initialized. Cannot fetch document '${documentId}' from '${collectionPath}'.`);
    return null;
  }
  console.log(`Firestore (Admin): Fetching document '${documentId}' from '${collectionPath}'`);
  const docRef = firestoreAdmin.collection(collectionPath).doc(documentId);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    return { id: docSnap.id, ...docSnap.data() } as T; // Include document ID in the result
  }
  return null;
}

/**
 * Sets (creates or overwrites) a document in a specified collection.
 * To be used on the server-side.
 */
export async function setDocument(collectionPath: string, documentId: string, data: any, options?: { merge?: boolean }): Promise<void> {
  if (!firestoreAdmin) {
    console.warn(`Firestore (Admin): SDK not initialized. Cannot set document '${documentId}' in '${collectionPath}'.`);
    return;
  }
  console.log(`Firestore (Admin): Setting document '${documentId}' in '${collectionPath}' with merge: ${options?.merge ?? false}`);
  const docRef = firestoreAdmin.collection(collectionPath).doc(documentId);
  await docRef.set(data, { merge: options?.merge ?? true }); // Default to merge: true to avoid accidental overwrites
}

/**
 * Updates specific fields of a document.
 * To be used on the server-side.
 */
export async function updateDocument(collectionPath: string, documentId: string, data: any): Promise<void> {
  if (!firestoreAdmin) {
    console.warn(`Firestore (Admin): SDK not initialized. Cannot update document '${documentId}' in '${collectionPath}'.`);
    return;
  }
  console.log(`Firestore (Admin): Updating document '${documentId}' in '${collectionPath}'`);
  const docRef = firestoreAdmin.collection(collectionPath).doc(documentId);
  await docRef.update(data);
}

/**
 * Deletes a document.
 * To be used on the server-side.
 */
export async function deleteDocument(collectionPath: string, documentId: string): Promise<void> {
  if (!firestoreAdmin) {
    console.warn(`Firestore (Admin): SDK not initialized. Cannot delete document '${documentId}' from '${collectionPath}'.`);
    return;
  }
  console.log(`Firestore (Admin): Deleting document '${documentId}' from '${collectionPath}'`);
  const docRef = firestoreAdmin.collection(collectionPath).doc(documentId);
  await docRef.delete();
}

/**
 * Fetches all documents from a collection. Use with caution for large collections.
 * To be used on the server-side.
 */
export async function getCollection<T>(collectionPath: string): Promise<T[]> {
    if (!firestoreAdmin) {
        console.warn(`Firestore (Admin): SDK not initialized. Cannot fetch collection '${collectionPath}'.`);
        return [];
    }
    console.log(`Firestore (Admin): Fetching all documents from '${collectionPath}'`);
    const snapshot = await firestoreAdmin.collection(collectionPath).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
}

console.log("Firestore utility module (src/lib/db/firestore.ts) loaded with Admin SDK functions.");
