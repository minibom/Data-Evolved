// src/app/api/social/friends/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock friends data (in real app, from Firestore)
const mockUserFriends: Record<string, { friends: string[], pendingRequests: string[], sentRequests: string[] }> = {
  "user123": { friends: ["friend456"], pendingRequests: ["friend789"], sentRequests: [] },
  "friend456": { friends: ["user123"], pendingRequests: [], sentRequests: [] },
  "friend789": { friends: [], pendingRequests: [], sentRequests: ["user123"] },
};

export async function GET(request: NextRequest) {
  // Requires auth to get playerId
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); 

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 401 });
  }
  const friendsData = mockUserFriends[playerId] || { friends: [], pendingRequests: [], sentRequests: [] };
  return NextResponse.json(friendsData);
}

export async function POST(request: NextRequest) {
  // Send friend request
  // Requires auth to get senderPlayerId
  const { searchParams } = new URL(request.url);
  const senderPlayerId = searchParams.get('senderPlayerId'); 

  if (!senderPlayerId) {
    return NextResponse.json({ error: 'Sender Player ID is required' }, { status: 401 });
  }

  try {
    const { targetPlayerId } = await request.json();
    if (!targetPlayerId) {
      return NextResponse.json({ error: 'Target Player ID is required' }, { status: 400 });
    }
    // ... logic to add to sentRequests for sender, pendingRequests for target ...
    console.log(`Player ${senderPlayerId} sent friend request to ${targetPlayerId}`);
    return NextResponse.json({ message: "Friend request sent." });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send friend request' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  // Accept or decline friend request
  // Requires auth to get playerId (the one accepting/declining)
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId');

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 401 });
  }
  
  try {
    const { requestPlayerId, status } = await request.json(); // status: 'accept' or 'decline'
    if (!requestPlayerId || !status) {
      return NextResponse.json({ error: 'Request Player ID and status are required' }, { status: 400 });
    }
    // ... logic to update friend lists for both players based on status ...
    console.log(`Player ${playerId} ${status}ed friend request from ${requestPlayerId}`);
    return NextResponse.json({ message: `Friend request ${status}ed.` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update friend request' }, { status: 500 });
  }
}
