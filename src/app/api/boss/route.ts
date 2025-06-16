// src/app/api/boss/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import type { WorldBoss } from '@packages/common-types/boss';

// Mock boss data (in real app, from DB or AI generated)
let currentBoss: any | null = {
    id: "boss_glitchzilla_001",
    name: "Glitchzilla, Nexus Devourer",
    maxHp: 1000000,
    currentHp: 850000,
    spawnTime: new Date(Date.now() - 3600000 * 0.5).toISOString(), // Spawned 30 mins ago
    activeParticipants: [], // [{ playerId: string, damageDealt: number }]
};

export async function GET(request: NextRequest) {
  // Get current boss info
  if (currentBoss) {
    return NextResponse.json(currentBoss);
  }
  return NextResponse.json({ message: "No active world boss currently." }, { status: 404 });
}

export async function POST(request: NextRequest) {
  // For actions like joining a raid or dealing damage
  // Requires auth to get playerId
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); 

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
  }
  if (!currentBoss) {
    return NextResponse.json({ error: 'No active boss to interact with' }, { status: 404 });
  }

  try {
    const { action, damage } = await request.json(); // action: 'join', 'attack'

    if (action === 'join') {
        // Add player to participants if not already there
        console.log(`Player ${playerId} joining raid for boss ${currentBoss.id}`);
    } else if (action === 'attack' && typeof damage === 'number') {
        currentBoss.currentHp = Math.max(0, currentBoss.currentHp - damage);
        // Update player damage dealt
        console.log(`Player ${playerId} dealt ${damage} to boss ${currentBoss.id}. New HP: ${currentBoss.currentHp}`);
        if (currentBoss.currentHp === 0) {
            console.log(`Boss ${currentBoss.id} defeated!`);
            // ... handle boss defeat logic (rewards, new boss spawn timer) ...
            // currentBoss = null; // For example
        }
    } else {
        return NextResponse.json({ error: 'Invalid action or missing damage' }, { status: 400 });
    }
    
    return NextResponse.json({ message: 'Boss interaction successful', boss: currentBoss });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process boss interaction' }, { status: 500 });
  }
}
