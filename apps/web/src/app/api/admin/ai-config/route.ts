// src/app/api/admin/ai-config/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/server-auth'; 
import type { DynamicAIConfig } from '@packages/common-types/aiConfig'; // Using common type
import { getDocument, setDocument } from '@/lib/db/firestore'; // Using Firestore utilities

const CONFIG_COLLECTION = 'systemConfigurations'; // Firestore collection for storing system configs
const AI_CONFIG_DOC_ID = 'dynamicAIConfig';    // Specific document ID for AI config

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth(request); // Protect route
  } catch (authError: any) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }
  
  console.log("Admin API: Fetching AI config from Firestore.");
  try {
    const config = await getDocument<DynamicAIConfig>(CONFIG_COLLECTION, AI_CONFIG_DOC_ID);
    if (config) {
      return NextResponse.json(config);
    } else {
      // If no config exists, return a default or indicate it's not found
      // For now, let's assume it might not exist and a new one can be created via POST
      console.log("Admin API: AI config not found in Firestore. Default might be used or created on POST.");
      return NextResponse.json({ 
        parameters: [], 
        aiCoreGoals: [], 
        anonymousGoals: [], 
        lastUpdated: new Date().toISOString(), 
        message: "AI Configuration not found, default structure returned."
      }, { status: 200 }); // Return 200 with default/empty structure
    }
  } catch (dbError: any) {
    console.error("Admin API: Error fetching AI config from Firestore:", dbError);
    return NextResponse.json({ error: 'Failed to fetch AI configuration from database.', details: dbError.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth(request); // Protect route
  } catch (authError: any) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  try {
    const newConfigData = await request.json() as Partial<DynamicAIConfig>;
    // TODO: Add validation for newConfigData fields here (e.g., using Zod for DynamicAIConfigSchema)
    
    const configToSave: DynamicAIConfig = {
      parameters: newConfigData.parameters || [],
      aiCoreGoals: newConfigData.aiCoreGoals || [],
      anonymousGoals: newConfigData.anonymousGoals || [],
      lastUpdated: new Date().toISOString(),
      updatedBy: (await requireAdminAuth(request)).email || 'admin', // Store who updated it
    };

    await setDocument(CONFIG_COLLECTION, AI_CONFIG_DOC_ID, configToSave, { merge: false }); // Overwrite with new config
    console.log("Admin API: AI config updated in Firestore:", configToSave);
    return NextResponse.json({ message: 'AI configuration updated successfully', config: configToSave });

  } catch (error: any) {
    console.error('Admin API: Error updating AI configuration in Firestore:', error);
    return NextResponse.json({ error: 'Failed to update AI configuration.', details: error.message }, { status: 500 });
  }
}
