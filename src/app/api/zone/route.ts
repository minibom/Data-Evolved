// src/app/api/zone/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import zonesData from '@/data/zones.json'; // Assuming you have this
// import type { ZoneStateDoc } from '@packages/common-types/db'; // Or your specific zone type

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

export async function GET(request: NextRequest) {
  // Get all zone states or a specific zone by ID
  const { searchParams } = new URL(request.url);
  const zoneId = searchParams.get('zoneId');

  if (zoneId) {
    const zone = mockZoneStates[zoneId];
    if (zone) return NextResponse.json(zone);
    return NextResponse.json({ error: "Zone not found" }, { status: 404 });
  }
  return NextResponse.json(Object.values(mockZoneStates));
}

export async function POST(request: NextRequest) {
  // Player interacts with a zone (e.g., completes core mission, contributes sync points, initiates upgrade)
  // Requires auth to get playerId
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); 
  const playerFactionId = searchParams.get('playerFactionId');

  if (!playerId || !playerFactionId) {
    return NextResponse.json({ error: 'Player ID and Faction ID are required' }, { status: 401 });
  }

  try {
    const { zoneId, action, value } = await request.json(); // action: 'complete_core_mission', 'add_sync_points', 'start_upgrade'
    if (!zoneId || !action) {
      return NextResponse.json({ error: 'Zone ID and action are required' }, { status: 400 });
    }
    const zone = mockZoneStates[zoneId];
    if (!zone) return NextResponse.json({ error: "Zone not found" }, { status: 404 });

    if (action === 'add_sync_points' && typeof value === 'number') {
      zone.synchronizationPoints[playerFactionId] = (zone.synchronizationPoints[playerFactionId] || 0) + value;
      // ... logic to check if faction control changes ...
      console.log(`Player ${playerId} added ${value} sync points to ${zoneId} for faction ${playerFactionId}. New points: ${zone.synchronizationPoints[playerFactionId]}`);
    } else if (action === 'complete_core_mission') {
        // ... logic to mark core mission complete for player/faction, trigger contest phase ...
        console.log(`Player ${playerId} completed core mission in ${zoneId}. Zone now contested (placeholder).`);
        zone.status = 'contested';
    }
    // ... other actions like starting upgrades, etc. ...
    
    return NextResponse.json({ message: `Zone ${zoneId} interaction successful`, zone });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process zone interaction' }, { status: 500 });
  }
}
