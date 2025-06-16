// @/app/api/auth/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { setDocument } from '@/lib/db/firestore'; 
import { requireAuth } from '@/lib/auth/server-auth'; // To ensure only authenticated users can trigger profile creation

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || !body.action) {
    return NextResponse.json({ error: 'Action not specified or invalid request body.' }, { status: 400 });
  }
  
  const { action, uid, email, displayName } = body;

  if (action === 'create_profile') {
    let authenticatedUser;
    try {
      // This route is called *after* Firebase Auth client-side has created the user.
      // We re-verify the token here to ensure the request is legitimate.
      authenticatedUser = await requireAuth(request);
      if (authenticatedUser.uid !== uid) { // Ensure the token UID matches the UID in body
        return NextResponse.json({ error: 'UID mismatch or unauthorized profile creation attempt.' }, { status: 403 });
      }
    } catch (authError: any) {
      console.error("API Auth 'create_profile' Auth Error:", authError.message);
      return NextResponse.json({ error: 'Unauthorized: ' + authError.message }, { status: 401 });
    }
    
    if (!uid || !email) {
      return NextResponse.json({ error: 'UID and email are required to create a profile.' }, { status: 400 });
    }
    try {
      const userProfileData = { 
        email, 
        displayName: displayName || email.split('@')[0], // Default display name
        createdAt: new Date().toISOString(), 
        // Initialize other game-specific fields here
        // e.g., currentGHZ: 0, level: 1, stats: { ...defaultStats }
      };
      await setDocument('userProfiles', uid, userProfileData); // Use 'userProfiles' or similar collection name
      console.log(`API Auth: User profile document created/updated in Firestore for UID ${uid}.`);
      return NextResponse.json({ message: "User profile creation/update successful.", uid }, { status: 201 });
    } catch (error: any) {
      console.error("API Auth Create Profile (Firestore) Error:", error);
      return NextResponse.json({ error: error.message || 'Failed to create/update user profile in Firestore.' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid action specified for /api/auth POST.' }, { status: 400 });
}
