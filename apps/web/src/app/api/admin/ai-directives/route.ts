import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { AIDirective } from '@packages/common-types/aiFaction';
import { requireAdminAuth } from '@/lib/auth/server-auth';
import { getCollection, setDocument, updateDocument, getDocument } from '@/lib/db/firestore';

const DIRECTIVES_COLLECTION = 'aiDirectivesLog';

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth(request); // Protect route
  } catch (authError: any) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  try {
    const directives = await getCollection<AIDirective>(DIRECTIVES_COLLECTION);
    // Sort by timestamp descending if not already handled by Firestore query
    directives.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return NextResponse.json(directives.slice(0, 50)); // Return latest 50
  } catch (dbError: any) {
    console.error("Admin API: Error fetching AI directives:", dbError);
    return NextResponse.json({ error: 'Failed to fetch AI directives.', details: dbError.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // This endpoint is called by the AI Orchestrator or potentially by an admin manually creating a directive
  // If called by orchestrator, it might not need admin auth, but a service account or specific API key.
  // For now, let's assume admin rights if it's a direct call for manual creation.
  let actingUser = "SYSTEM_ORCHESTRATOR";
  try {
    const user = await requireAdminAuth(request); // Optional: if admins can also create directives
    actingUser = user.email || user.uid;
  } catch (authError) {
    // If not admin, could be orchestrator. For now, allow if no auth header but log.
    if (!request.headers.get('Authorization')) {
        console.log("AI Directives POST: No auth header, assuming internal call from orchestrator.");
    } else {
        return NextResponse.json({ error: (authError as Error).message }, { status: 401 });
    }
  }


  try {
    const newDirectiveData = await request.json();
    if (!newDirectiveData.factionName || !newDirectiveData.directive || !newDirectiveData.rawOutput) {
      return NextResponse.json({ error: 'Missing required fields for directive (factionName, directive, rawOutput)' }, { status: 400 });
    }

    const directiveId = `${newDirectiveData.factionName.toLowerCase()}-${Date.now()}`;
    const newDirective: AIDirective = {
      id: directiveId,
      timestamp: new Date().toISOString(),
      status: 'pending_review', // New directives should be reviewed
      ...newDirectiveData,
      createdBy: actingUser, // Log who/what created it
    };
    
    await setDocument(DIRECTIVES_COLLECTION, directiveId, newDirective);
    console.log(`Admin API: New AI directive ${directiveId} logged to Firestore.`);
    return NextResponse.json(newDirective, { status: 201 });
  } catch (error: any) {
    console.error("Admin API: Error processing new AI directive:", error);
    return NextResponse.json({ error: 'Failed to process new AI directive.', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  let adminUser;
  try {
    adminUser = await requireAdminAuth(request);
  } catch (authError: any) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing directive ID or new status' }, { status: 400 });
    }
    
    const validStatuses: AIDirective['status'][] = ['active', 'overridden', 'pending_review', 'archived'];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    const existingDirective = await getDocument<AIDirective>(DIRECTIVES_COLLECTION, id);
    if (!existingDirective) {
      return NextResponse.json({ error: 'Directive not found' }, { status: 404 });
    }

    await updateDocument(DIRECTIVES_COLLECTION, id, { 
        status: status, 
        lastStatusUpdateBy: adminUser.email || adminUser.uid,
        lastStatusUpdateAt: new Date().toISOString() 
    });
    const updatedDirective = { ...existingDirective, status, lastStatusUpdateBy: adminUser.email || adminUser.uid, lastStatusUpdateAt: new Date().toISOString() };

    console.log(`Admin API: Directive ${id} status updated to ${status} by ${adminUser.email}.`);
    return NextResponse.json(updatedDirective);

  } catch (error: any) {
    console.error("Admin API: Error updating directive status:", error);
    return NextResponse.json({ error: 'Failed to update directive status.', details: error.message }, { status: 500 });
  }
}
