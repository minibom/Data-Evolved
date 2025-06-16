// src/app/api/zone-control/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import type { ZoneStateDoc } from '@packages/common-types/db'; // Or your specific zone type

// This API route handles player interactions related to controlling and developing zones.
// It replaces the previous more general /api/zone/route.ts for better specificity.

// Mock zone states (in real app, from Firestore)
const mockZoneStates: Record<string, any> = {
  "zone_alpha_nexus_hub": { 
    zoneId: "zone_alpha_nexus_hub", 
    name: "Nexus Hub Alpha", 
    controllingFactionId: "AICore", 
    status: "stable", 
    synchronizationPoints: { "AICore": 1000, "Hacker": 200 },
    activeEvents: [],
    upgrades: { "data_conduit_mk1": 1 }
  },
  "zone_beta_data_stream": { 
    zoneId: "zone_beta_data_stream", 
    name: "Beta Data Stream Corridor", 
    controllingFactionId: null, 
    status: "contested",
    synchronizationPoints: { "AICore": 500, "Hacker": 550 },
    activeEvents: ["minor_anomaly_surge"],
    upgrades: {}
  },
};

// Note: GET for specific zone control data might be better handled by /api/zone?zoneId=... for consistency,
// but for actions, this dedicated route is good.
// For this iteration, we'll keep GET here to list controllable aspects if needed, or specific status for control actions.

export async function GET(request: NextRequest) {
  // This GET could list zones available for control actions by the player,
  // or provide detailed status relevant to zone control for a specific zone.
  const { searchParams } = new URL(request.url);
  const zoneId = searchParams.get('zoneId');

  if (zoneId) {
    const zone = mockZoneStates[zoneId];
    if (zone) return NextResponse.json(zone); // Return full state for context
    return NextResponse.json({ error: "Zone not found for control actions" }, { status: 404 });
  }
  // Maybe return a summary of zones the player can interact with for control purposes
  return NextResponse.json({ message: "Specify a zoneId to get control-relevant status." });
}

export async function POST(request: NextRequest) {
  // Player interacts with a zone (e.g., completes core mission, contributes sync points, initiates upgrade)
  // Requires auth to get playerId
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); 
  const playerFactionId = searchParams.get('playerFactionId');

  if (!playerId || !playerFactionId) {
    return NextResponse.json({ error: 'Player ID and Faction ID are required for zone control actions' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { zoneId, action, value, upgradeId } = body; 
    
    if (!zoneId || !action) {
      return NextResponse.json({ error: 'Zone ID and action are required' }, { status: 400 });
    }
    const zone = mockZoneStates[zoneId];
    if (!zone) return NextResponse.json({ error: "Zone not found" }, { status: 404 });

    if (action === 'add_sync_points' && typeof value === 'number') {
      zone.synchronizationPoints[playerFactionId] = (zone.synchronizationPoints[playerFactionId] || 0) + value;
      // TODO: Add logic to check if faction control changes based on sync points
      console.log(`ZoneControlAPI: Player ${playerId} added ${value} sync points to ${zoneId} for faction ${playerFactionId}. New points: ${zone.synchronizationPoints[playerFactionId]}`);
    } else if (action === 'complete_core_mission') {
        // TODO: Add logic to mark core mission complete for player/faction, trigger contest phase
        console.log(`ZoneControlAPI: Player ${playerId} completed core mission in ${zoneId}. Zone status changing to 'contested' (placeholder).`);
        zone.status = 'contested'; // Example state change
    } else if (action === 'start_upgrade' && upgradeId) {
        if (zone.controllingFactionId === playerFactionId) {
            console.log(`ZoneControlAPI: Player ${playerId} (Faction: ${playerFactionId}) initiating upgrade '${upgradeId}' in zone ${zoneId}.`);
            // TODO: Check resources, start upgrade timer/process
            // For mock: zone.upgrades[upgradeId] = (zone.upgrades[upgradeId] || 0) + 1; // Example: increment level
            zone.upgrades = { ...zone.upgrades, [upgradeId]: (zone.upgrades[upgradeId] || 0) + 1 };
        } else {
            return NextResponse.json({ error: "Cannot start upgrade: Zone not controlled by player's faction." }, { status: 403 });
        }
    } else {
      return NextResponse.json({ error: 'Invalid action or missing parameters for zone control.' }, { status: 400 });
    }
    
    // Persist changes to mockZoneStates (or DB in real app)
    mockZoneStates[zoneId] = zone; 

    return NextResponse.json({ message: `Zone ${zoneId} interaction '${action}' successful`, zone });
  } catch (error: any) {
    console.error("ZoneControlAPI Error:", error);
    return NextResponse.json({ error: 'Failed to process zone control interaction', details: (error as Error).message }, { status: 500 });
  }
}
