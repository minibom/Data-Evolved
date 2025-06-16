// src/lib/auth/server-auth.ts
/**
 * This module contains server-side authentication logic, typically used in API routes
 * or server components to verify user identity and permissions.
 * It primarily relies on the Firebase Admin SDK to decode and verify ID tokens
 * sent from the client.
 */

import { authAdmin } from '../firebase'; // Firebase Admin SDK
import type { NextRequest } from 'next/server';
import type { DecodedIdToken } from 'firebase-admin/auth';

interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string; // displayName from token
  isAdmin?: boolean; // From custom claims
  // Add other relevant user properties from the decoded token or your user profile DB
}

/**
 * Verifies the Firebase ID token from the Authorization header of a NextRequest.
 * @param request The NextRequest object.
 * @returns A promise that resolves to an AuthenticatedUser object if verification is successful, otherwise null.
 */
export async function verifyFirebaseToken(request: NextRequest): Promise<AuthenticatedUser | null> {
  if (!authAdmin) {
    console.warn("ServerAuth: Firebase Admin SDK not initialized. Cannot verify token.");
    // In a strict environment, you might throw an error or return a more definitive auth failure.
    // For development, returning null allows other parts of the app to proceed with mock/unauthed state.
    return null; 
  }

  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    try {
      console.log("ServerAuth: Verifying Firebase ID token...");
      const decodedToken: DecodedIdToken = await authAdmin.verifyIdToken(idToken);
      console.log("ServerAuth: Token verified for UID:", decodedToken.uid);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name, // displayName from token
        isAdmin: !!decodedToken.admin, // Custom claim for admin role
      };
    } catch (error: any) {
      console.error('ServerAuth: Error verifying Firebase ID token:', error.code, error.message);
      return null;
    }
  }
  // console.log("ServerAuth: No Firebase ID token found in Authorization header.");
  return null;
}

/**
 * Middleware-like function to protect API routes by requiring authentication.
 * Can be used at the beginning of API route handlers.
 * @param request The NextRequest object.
 * @returns The AuthenticatedUser if valid.
 * @throws Error if authentication fails, which should be caught by the API route to return a 401/403.
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await verifyFirebaseToken(request);
  if (!user) {
    throw new Error('AuthenticationRequired: User is not authenticated or token is invalid.');
  }
  return user;
}

/**
 * Middleware-like function to protect API routes by requiring admin privileges.
 * @param request The NextRequest object.
 * @returns The AuthenticatedUser if valid and an admin.
 * @throws Error if authentication fails or user is not an admin.
 */
export async function requireAdminAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await requireAuth(request); // First, ensure they are authenticated
  if (!user.isAdmin) {
    throw new Error('AuthorizationError: User is not an administrator.');
  }
  return user;
}


console.log("Server-side authentication utilities (src/lib/auth/server-auth.ts) loaded.");
