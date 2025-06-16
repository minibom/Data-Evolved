// src/app/api/admin/zones/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/server-auth';
import { getCollection, updateDocument, getDocument } from '@/lib/db/firestore'; // Using Firestore utilities
import type { ZoneStateDoc } from '@packages/common-types/db';

const ZONES_COLLECTION = 'zones'; // Firestore collection for zone states

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth(request);
  } catch (authError: any) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }
  
  console.log("Admin API: Fetching all zone states from Firestore for admin panel.");
  try {
    const zones = await getCollection<ZoneStateDoc>(ZONES_COLLECTION);
    return NextResponse.json(zones);
  } catch (dbError: any) {
    console.error("Admin API: Error fetching zones from Firestore:", dbError);
    return NextResponse.json({ error: 'Failed to fetch zone states.', details: dbError.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) { // For updating a specific zone
  let adminUser;
  try {
    adminUser = await requireAdminAuth(request);
  } catch (authError: any) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  try {
    const { zoneId, updates } = await request.json() as { zoneId: string, updates: Partial<ZoneStateDoc> };
    if (!zoneId || !updates) {
      return NextResponse.json({ error: 'Zone ID and updates object are required.' }, { status: 400 });
    }
    
    const existingZone = await getDocument<ZoneStateDoc>(ZONES_COLLECTION, zoneId);
    if (!existingZone) {
      return NextResponse.json({ error: 'Zone not found.' }, { status: 404 });
    }

    const updatesWithLog = { 
      ...updates, 
      lastAdminUpdate: new Date().toISOString(), 
      lastAdminUpdateBy: adminUser.email || adminUser.uid 
    };
    
    await updateDocument(ZONES_COLLECTION, zoneId, updatesWithLog);
    
    const updatedZone = { ...existingZone, ...updatesWithLog };
    console.log(`Admin API: Zone ${zoneId} updated by admin ${adminUser.email}. New state fragment:`, updatesWithLog);
    return NextResponse.json({ message: `Zone ${zoneId} updated successfully.`, zone: updatedZone });

  } catch (error: any) {
    console.error("Admin API: Error updating zone:", error);
    return NextResponse.json({ error: 'Failed to update zone.', details: error.message }, { status: 500 });
  }
}
