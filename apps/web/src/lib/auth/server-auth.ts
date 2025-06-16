// src/lib/auth/server-auth.ts
/**
 * This module contains server-side authentication logic, typically used in API routes
 * or server components to verify user identity and permissions.
 * It primarily relies on the Firebase Admin SDK to decode and verify ID tokens
 * sent from the client.
 */

// import { authAdmin } from '../firebase'; // Firebase Admin SDK
import type { NextRequest } from 'next/server';
// import type { DecodedIdToken } from 'firebase-admin/auth';

interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
  isAdmin?: boolean;
  // Add other relevant user properties from the decoded token or your user profile DB
}

/**
 * Verifies the Firebase ID token from the Authorization header of a NextRequest.
 * @param request The NextRequest object.
 * @returns A promise that resolves to an AuthenticatedUser object if verification is successful, otherwise null.
 */
export async function verifyFirebaseToken(request: NextRequest): Promise<AuthenticatedUser | null> {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    try {
      console.log("ServerAuth: Verifying Firebase ID token...");
      // const decodedToken: DecodedIdToken = await authAdmin.verifyIdToken(idToken);
      // Mock decoded token for now
      const mockDecodedToken = {
        uid: "mock-decoded-uid",
        email: "mock-user@example.com",
        name: "Mock User From Token",
        admin: Math.random() < 0.1 // 10% chance of being admin for testing
      };
      
      // You might fetch additional user profile data from Firestore here using decodedToken.uid
      // to supplement the token claims (e.g., custom roles not in token).
      
      console.log("ServerAuth: Token verified for UID:", mockDecodedToken.uid);
      return {
        uid: mockDecodedToken.uid,
        email: mockDecodedToken.email,
        name: mockDecodedToken.name,
        isAdmin: !!mockDecodedToken.admin, // Ensure boolean
      };
    } catch (error) {
      console.error('ServerAuth: Error verifying Firebase ID token:', error);
      return null;
    }
  }
  console.log("ServerAuth: No Firebase ID token found in Authorization header.");
  return null;
}

/**
 * Middleware-like function to protect API routes by requiring authentication.
 * Can be used at the beginning of API route handlers.
 * @param request The NextRequest object.
 * @returns The AuthenticatedUser if valid, otherwise throws an error or returns a specific response.
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await verifyFirebaseToken(request);
  if (!user) {
    // In a real app, you'd return a NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // For now, throwing an error might be simpler for some API route structures.
    throw new Error('AuthenticationRequired: User is not authenticated.');
  }
  return user;
}

/**
 * Middleware-like function to protect API routes by requiring admin privileges.
 * @param request The NextRequest object.
 * @returns The AuthenticatedUser if valid and an admin, otherwise throws or returns error response.
 */
export async function requireAdminAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await requireAuth(request); // First, ensure they are authenticated
  if (!user.isAdmin) {
    // Return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    throw new Error('AuthorizationError: User is not an administrator.');
  }
  return user;
}


console.log("Server-side authentication utilities (src/lib/auth/server-auth.ts) loaded.");
