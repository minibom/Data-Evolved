// src/app/api/achievements/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import achievementsData from '@/data/achievements.json'; // Assuming you have this
// import type { Achievement } from '@packages/common-types/game'; // Or specific achievement types

// Mock player achievements (in real app, from Firestore)
const mockPlayerAchievements: Record<string, { achievementId: string, unlockedAt: string }[]> = {
    "player123": [
        { achievementId: "first_login", unlockedAt: new Date().toISOString() },
        { achievementId: "collect_10_scraps", unlockedAt: new Date().toISOString() },
    ],
};

// Mock available achievements
const availableAchievements = [
    { id: "first_login", name: "Nexus Initiate", description: "Logged into Data Evolved for the first time." },
    { id: "collect_10_scraps", name: "Scrap Collector", description: "Collected 10 Data Scraps." },
    { id: "reach_10_ghz", name: "Evolved Entity", description: "Reached 10 GHZ and chose a faction." },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); // In real app, get from session

  if (!playerId) {
    // Return all available achievements if no player specified
    return NextResponse.json(availableAchievements);
  }

  const unlocked = mockPlayerAchievements[playerId] || [];
  // Could also return a combined list of all achievements with their unlocked status for the player
  const allWithStatus = availableAchievements.map(ach => ({
    ...ach,
    isUnlocked: unlocked.some(u => u.achievementId === ach.id),
    unlockedAt: unlocked.find(u => u.achievementId === ach.id)?.unlockedAt
  }));
  return NextResponse.json(allWithStatus);
}

// POST could be used by the game server to notify of an achievement unlock,
// though often this is handled internally by game logic and then saved.
// For a client-driven game, the client might report an action that could unlock an achievement.
export async function POST(request: NextRequest) {
  // Potentially, a client reports an action, and server verifies if it unlocks an achievement.
  // Requires auth to get playerId
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); 

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 401 });
  }

  try {
    const { eventType, eventData } = await request.json(); // e.g., eventType: 'ENEMY_KILLED', eventData: { enemyType: 'corrupted_drone' }
    // ... logic to check if this event unlocks any achievements for the player ...
    // ... if unlocked, save to mockPlayerAchievements ...
    console.log(`Player ${playerId} triggered achievement event: ${eventType}`, eventData);
    return NextResponse.json({ message: "Achievement event processed (placeholder)" });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process achievement event' }, { status: 500 });
  }
}
