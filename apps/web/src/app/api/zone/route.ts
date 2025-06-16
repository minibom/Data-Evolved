// apps/web/src/app/api/zone/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This file is now a general information endpoint for zones.
// Player interactions like contributing sync points or completing core missions
// should ideally go to a more specific endpoint like /api/zone-control or /api/zone-actions.
// For now, keeping it as a GET endpoint for zone data.
// The old POST logic is now in /api/zone-control/route.ts

// Mock zone states (in real app, from Firestore)
const mockZoneData: Record<string, any> = {
  "zone_alpha_nexus_hub": { 
    zoneId: "zone_alpha_nexus_hub", 
    name: "Nexus Hub Alpha", 
    description: "A primary data exchange and processing hub, crucial for Quantum Nexus operations.",
    controllingFactionId: "AICore", 
    status: "stable", 
    synchronizationPoints: { "AICore": 1000, "Hacker": 200 },
    activeEvents: [],
    upgrades: { "data_conduit_mk1": 1 },
    staticData: { /* from zones.json */ }
  },
  "zone_beta_data_stream": { 
    zoneId: "zone_beta_data_stream", 
    name: "Beta Data Stream Corridor", 
    description: "An unstable region, ripe for exploitation or stabilization efforts.",
    controllingFactionId: null, 
    status: "contested",
    synchronizationPoints: { "AICore": 500, "Hacker": 550 },
    activeEvents: ["minor_anomaly_surge"],
    upgrades: {},
    staticData: { /* from zones.json */ }
  },
};

export async function GET(request: NextRequest) {
  // Get all zone states or a specific zone by ID
  const { searchParams } = new URL(request.url);
  const zoneId = searchParams.get('zoneId');

  if (zoneId) {
    const zone = mockZoneData[zoneId];
    if (zone) return NextResponse.json(zone);
    return NextResponse.json({ error: "Zone not found" }, { status: 404 });
  }
  return NextResponse.json(Object.values(mockZoneData));
}

// POST logic has been moved to /api/zone-control/route.ts
// If this route were to accept POSTs, it might be for admin-level zone modifications
// or global zone announcements, not player-specific actions.

console.log("API route /api/zone/ (general zone info) loaded. Player interactions moved to /api/zone-control/.");
