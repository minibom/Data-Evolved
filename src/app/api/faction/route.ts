// src/app/api/faction/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import factionsData from '@/data/factions.json'; // Assuming you have this
// import type { Faction } from '@packages/common-types/faction'; // Or your specific faction type

// Mock player faction data (in real app, from user profile in DB)
const playerFactions: Record<string, { factionId: string, joinedAt: string }> = {};

export async function GET(request: NextRequest) {
  // Get list of all factions or a specific player's faction
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId');

  if (playerId) {
    const playerFactionInfo = playerFactions[playerId];
    if (playerFactionInfo) {
      // Could also fetch full faction details from factions.json
      return NextResponse.json(playerFactionInfo);
    }
    return NextResponse.json({ message: "Player has not chosen a faction." });
  }
  // Return all available factions (from data/factions.json ideally)
  const allFactions = [ // Placeholder for data/factions.json
    { id: "AICore", name: "AI Core", description: "Guardians of Nexus stability." },
    { id: "Hacker", name: "Shadow Decoders", description: "Advocates for data freedom." },
  ];
  return NextResponse.json(allFactions);
}

export async function POST(request: NextRequest) {
  // Player chooses a faction
  // Requires auth to get playerId
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); 

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 401 });
  }
  
  try {
    const { factionId } = await request.json();
    if (!factionId || (factionId !== "AICore" && factionId !== "Hacker")) { // Validate factionId
      return NextResponse.json({ error: 'Valid faction ID (AICore or Hacker) is required' }, { status: 400 });
    }

    if (playerFactions[playerId]) {
        return NextResponse.json({ error: 'Player has already chosen a faction. Assimilation protocol required to change.' }, { status: 400 });
    }
    
    // Check if player meets criteria (e.g., GHZ >= 10) - this should be checked client-side too
    // but server-side validation is key.
    // For now, we assume client handles this check.

    playerFactions[playerId] = { factionId, joinedAt: new Date().toISOString() };
    // Also update the main user profile document with this factionId.
    console.log(`Player ${playerId} joined faction ${factionId}`);
    return NextResponse.json({ message: `Successfully joined faction ${factionId}`, factionInfo: playerFactions[playerId] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join faction' }, { status: 500 });
  }
}

// PATCH could be used for Assimilation Protocol (changing faction) - more complex logic
export async function PATCH(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId'); 

    if (!playerId) {
        return NextResponse.json({ error: 'Player ID is required' }, { status: 401 });
    }
    
    try {
        const { newFactionId, reason } = await request.json(); // reason could be 'assimilation'
        if (!newFactionId || (newFactionId !== "AICore" && newFactionId !== "Hacker")) {
             return NextResponse.json({ error: 'Valid new faction ID is required' }, { status: 400 });
        }
        if (!playerFactions[playerId]) {
            return NextResponse.json({ error: 'Player must join a faction first before changing.' }, { status: 400 });
        }
        if (reason !== 'assimilation') { // Or other valid reasons for faction change
             return NextResponse.json({ error: 'Invalid reason for faction change.' }, { status: 400 });
        }

        console.log(`Player ${playerId} is being assimilated into faction ${newFactionId}`);
        playerFactions[playerId] = { factionId: newFactionId, joinedAt: new Date().toISOString() };
        // Additional logic for assimilation: reset some faction-specific progress, apply debuffs, etc.
        return NextResponse.json({ message: `Player ${playerId} assimilated into ${newFactionId}.` });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to process faction change' }, { status: 500 });
    }
}
