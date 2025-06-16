// src/app/api/admin/zones/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { verifyAdmin } from '@/lib/auth/server-auth';
// import { getAllZonesFromDB, updateZoneInDB } from '@/lib/db/firestore'; // Example DB functions
// import type { ZoneStateDoc } from '@packages/common-types/db';

// Mock zone states (in real app, from Firestore)
let adminMockZoneStates: Record<string, any> = {
  "zone_alpha_nexus_hub": { 
    zoneId: "zone_alpha_nexus_hub", 
    name: "Nexus Hub Alpha (Admin View)", 
    controllingFactionId: "AICore", 
    status: "stable", 
    synchronizationPoints: { "AICore": 1000, "Hacker": 200 },
    stabilityIndex: 0.9, // Example admin-visible metric
    playerCount: 25,    // Example admin-visible metric
    activeEvents: [],
    upgrades: { "data_conduit_mk1": 1 }
  },
  "zone_beta_data_stream": { 
    zoneId: "zone_beta_data_stream", 
    name: "Beta Data Stream (Admin View)", 
    controllingFactionId: null, 
    status: "contested",
    synchronizationPoints: { "AICore": 500, "Hacker": 550 },
    stabilityIndex: 0.5,
    playerCount: 12,
    activeEvents: ["minor_anomaly_surge"],
    upgrades: {}
  },
};

export async function GET(request: NextRequest) {
  // const isAdmin = await verifyAdmin(request);
  // if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  
  // const zones = await getAllZonesFromDB();
  console.log("Admin API: Fetching all zone states for admin panel.");
  return NextResponse.json(Object.values(adminMockZoneStates));
}

export async function POST(request: NextRequest) { // For updating a specific zone
  // const isAdmin = await verifyAdmin(request);
  // if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { zoneId, updates } = await request.json() as { zoneId: string, updates: Partial<any> /* ZoneStateDoc */ };
    if (!zoneId || !updates) {
      return NextResponse.json({ error: 'Zone ID and updates are required.' }, { status: 400 });
    }
    
    if (!adminMockZoneStates[zoneId]) {
      return NextResponse.json({ error: 'Zone not found.' }, { status: 404 });
    }

    // Apply updates (in real app, validate updates carefully)
    adminMockZoneStates[zoneId] = { ...adminMockZoneStates[zoneId], ...updates, lastAdminUpdate: new Date().toISOString() };
    // await updateZoneInDB(zoneId, updates);
    
    console.log(`Admin API: Zone ${zoneId} updated by admin. New state:`, adminMockZoneStates[zoneId]);
    return NextResponse.json({ message: `Zone ${zoneId} updated successfully.`, zone: adminMockZoneStates[zoneId] });

  } catch (error: any) {
    console.error("Admin API: Error updating zone:", error);
    return NextResponse.json({ error: 'Failed to update zone.', details: error.message }, { status: 500 });
  }
}
