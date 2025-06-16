// src/app/api/pvp/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface PvpEncounterResult {
    encounterId: string;
    winnerId: string;
    loserId: string;
    winnerFactionId?: string;
    loserFactionId?: string;
    zoneId?: string;
    timestamp: string;
    wasAssimilation: boolean; // True if loser was assimilated
}

// Mock PvP encounter log
const mockPvpLog: PvpEncounterResult[] = [];

export async function POST(request: NextRequest) {
  // Report a PvP encounter result
  // This would typically be called by a trusted game server instance after validating a combat outcome.
  // For a client-authoritative model (less secure), clients might report, but server must validate.
  // Requires auth for both players involved if client-reported, or server identity.

  try {
    const { winnerId, loserId, winnerFactionId, loserFactionId, zoneId } = await request.json();
    if (!winnerId || !loserId ) {
      return NextResponse.json({ error: 'Winner ID and Loser ID are required' }, { status: 400 });
    }

    let wasAssimilation = false;
    // Assimilation Protocol Logic:
    // If winner and loser are from different factions:
    if (winnerFactionId && loserFactionId && winnerFactionId !== loserFactionId) {
        // Placeholder: 20% chance of assimilation
        if (Math.random() < 0.20) { 
            wasAssimilation = true;
            // Here you would trigger the faction change for the loserId
            // This might involve calling the /api/faction PATCH endpoint or an internal service.
            console.log(`ASSIMILATION PROTOCOL: Player ${loserId} (${loserFactionId}) assimilated by ${winnerId} (${winnerFactionId})!`);
            // Update loser's faction in your user data store.
            // For mock: playerFactions[loserId] = { factionId: winnerFactionId, joinedAt: new Date().toISOString() }; (from faction/route.ts mock)
        }
    }

    const encounter: PvpEncounterResult = {
        encounterId: `pvp_${Date.now()}`,
        winnerId,
        loserId,
        winnerFactionId,
        loserFactionId,
        zoneId,
        timestamp: new Date().toISOString(),
        wasAssimilation,
    };
    mockPvpLog.unshift(encounter); // Add to beginning
    if (mockPvpLog.length > 100) mockPvpLog.pop(); // Keep log size manageable

    console.log("PvP Encounter Logged:", encounter);
    return NextResponse.json(encounter, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to log PvP encounter' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
    // Get PvP logs, perhaps filtered by player, faction, or zone
    // For simplicity, return all for now
    return NextResponse.json(mockPvpLog);
}
