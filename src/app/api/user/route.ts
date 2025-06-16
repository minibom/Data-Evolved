// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Placeholder for user profile type
interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  factionId?: 'AICore' | 'Hacker'; // Example factions
  ghz: number;
  // other user-specific data
}

// Mock user database
const mockUsers: Record<string, UserProfile> = {
  "user123": { id: "user123", email: "user@example.com", displayName: "Test User", ghz: 5, factionId: undefined },
  "admin456": { id: "admin456", email: "admin@example.com", displayName: "Admin User", ghz: 50, factionId: 'AICore' },
};

export async function GET(request: NextRequest) {
  // In a real app, you'd get the userId from an authenticated session
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId'); // Or from session

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required or not authenticated' }, { status: 401 });
  }

  const user = mockUsers[userId];
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  // In a real app, you'd get the userId from an authenticated session
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId'); // Or from session
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required or not authenticated for update' }, { status: 401 });
  }

  if (!mockUsers[userId]) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const updates = await request.json();
    // Basic validation: only allow updating specific fields
    const allowedUpdates: Partial<UserProfile> = {};
    if (updates.displayName) allowedUpdates.displayName = updates.displayName;
    if (updates.factionId && ['AICore', 'Hacker'].includes(updates.factionId)) allowedUpdates.factionId = updates.factionId;
    if (typeof updates.ghz === 'number') allowedUpdates.ghz = updates.ghz;
    // Add more updatable fields like stats (Power, Memory, Firewall) here

    mockUsers[userId] = { ...mockUsers[userId], ...allowedUpdates };
    console.log(`User ${userId} updated:`, mockUsers[userId]);
    return NextResponse.json({ message: 'User profile updated successfully', user: mockUsers[userId] });

  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
