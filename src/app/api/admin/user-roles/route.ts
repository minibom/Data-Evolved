// src/app/api/admin/user-roles/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { verifyAdmin } from '@/lib/auth'; // Placeholder for admin verification

// Mock user roles data (in a real app, this would be in Firestore or your DB)
const mockUserRoles: Record<string, { roles: string[] }> = {
  "user123": { roles: ["player"] },
  "admin456": { roles: ["player", "admin"] },
};

export async function GET(request: NextRequest) {
  // if (!await verifyAdmin(request)) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  // }
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(mockUserRoles); // Return all if no specific user
  }

  const userRoleInfo = mockUserRoles[userId];
  if (!userRoleInfo) {
    return NextResponse.json({ error: 'User roles not found' }, { status: 404 });
  }
  return NextResponse.json(userRoleInfo);
}

export async function POST(request: NextRequest) {
  // if (!await verifyAdmin(request)) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  // }
  try {
    const { userId, roles } = await request.json();
    if (!userId || !Array.isArray(roles)) {
      return NextResponse.json({ error: 'User ID and roles array are required' }, { status: 400 });
    }
    // Validate roles if necessary
    mockUserRoles[userId] = { roles };
    console.log(`Admin action: Roles for user ${userId} updated to:`, roles);
    return NextResponse.json({ message: 'User roles updated successfully', userId, roles });
  } catch (error) {
    console.error('Error updating user roles:', error);
    return NextResponse.json({ error: 'Failed to update user roles' }, { status: 500 });
  }
}
