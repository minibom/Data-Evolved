// src/app/api/admin/user-roles/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/server-auth';
import { authAdmin } from '@/lib/firebase'; // Firebase Admin SDK for setting custom claims

// This API route would typically fetch user roles from custom claims or a Firestore collection.
// For setting roles, it would use Firebase Admin SDK to set custom claims.

interface UserRoleInfo {
  uid: string;
  email?: string;
  displayName?: string;
  roles: string[]; // e.g., ['player', 'admin', 'moderator']
  customClaims?: Record<string, any>;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth(request);
  } catch (authError: any) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!authAdmin) {
    return NextResponse.json({ error: 'Firebase Admin SDK not initialized.' }, { status: 500 });
  }

  if (!userId) {
    // List all users (use with pagination in a real app)
    try {
      const listUsersResult = await authAdmin.listUsers(100); // Max 1000 per call
      const usersWithRoles: UserRoleInfo[] = listUsersResult.users.map(userRecord => ({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        roles: userRecord.customClaims?.admin ? ['admin', 'player'] : ['player'], // Example logic
        customClaims: userRecord.customClaims,
      }));
      return NextResponse.json(usersWithRoles);
    } catch (error: any) {
      console.error('Admin API: Error listing users:', error);
      return NextResponse.json({ error: 'Failed to list users.', details: error.message }, { status: 500 });
    }
  }

  // Get specific user roles
  try {
    const userRecord = await authAdmin.getUser(userId);
    const userRoleInfo: UserRoleInfo = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      roles: userRecord.customClaims?.admin ? ['admin', 'player'] : ['player'], // Example
      customClaims: userRecord.customClaims,
    };
    return NextResponse.json(userRoleInfo);
  } catch (error: any)
 {
    console.error(`Admin API: Error fetching user ${userId}:`, error);
    if ((error as any).code === 'auth/user-not-found') {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch user roles.', details: (error as any).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let adminUser;
  try {
    adminUser = await requireAdminAuth(request);
  } catch (authError: any) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }
  
  if (!authAdmin) {
    return NextResponse.json({ error: 'Firebase Admin SDK not initialized.' }, { status: 500 });
  }

  try {
    const { userId, newRoles } = await request.json() as { userId: string, newRoles: string[] };
    if (!userId || !Array.isArray(newRoles)) {
      return NextResponse.json({ error: 'User ID and roles array are required.' }, { status: 400 });
    }

    // Example: Set 'admin' custom claim based on roles array
    const currentCustomClaims = (await authAdmin.getUser(userId)).customClaims || {};
    const newCustomClaims: Record<string, any> = { ...currentCustomClaims };
    
    if (newRoles.includes('admin')) {
      newCustomClaims.admin = true;
    } else {
      delete newCustomClaims.admin; // Remove admin claim if 'admin' role is not present
    }
    // Add other role to claim mappings as needed

    await authAdmin.setCustomUserClaims(userId, newCustomClaims);
    
    console.log(`Admin API: Roles for user ${userId} updated by ${adminUser.email}. New claims:`, newCustomClaims);
    return NextResponse.json({ message: 'User roles (custom claims) updated successfully.', userId, customClaims: newCustomClaims });
  } catch (error: any) {
    console.error('Admin API: Error updating user roles (custom claims):', error);
    if ((error as any).code === 'auth/user-not-found') {
        return NextResponse.json({ error: 'User not found to update claims.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update user roles.', details: (error as any).message }, { status: 500 });
  }
}
