// src/app/api/admin/ai-config/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { verifyAdmin } from '@/lib/auth'; // Placeholder for admin verification

// Placeholder for AIConfig type (will be imported from @packages/common-types)
interface AIConfig {
  aiCoreAggressiveness: number; // 0-1
  anonymousDisruptionFrequency: number; // 0-1
  worldEventGenerationRate: number; // events per hour
  npcDialogueComplexity: number; // 0-1
  // Add more AI parameters here
  lastUpdated: string;
}

// Mock database for AI config
let mockAIConfig: AIConfig = {
  aiCoreAggressiveness: 0.6,
  anonymousDisruptionFrequency: 0.3,
  worldEventGenerationRate: 0.5,
  npcDialogueComplexity: 0.7,
  lastUpdated: new Date().toISOString(),
};

export async function GET(request: NextRequest) {
  // if (!await verifyAdmin(request)) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  // }
  console.log("Admin request: Fetching AI config.");
  return NextResponse.json(mockAIConfig);
}

export async function POST(request: NextRequest) {
  // if (!await verifyAdmin(request)) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  // }

  try {
    const newConfig = await request.json();
    // Add validation for newConfig fields here (e.g., using Zod)
    // For example, ensure values are within expected ranges

    mockAIConfig = { ...mockAIConfig, ...newConfig, lastUpdated: new Date().toISOString() };
    console.log("Admin action: AI config updated:", mockAIConfig);
    return NextResponse.json({ message: 'AI configuration updated successfully', config: mockAIConfig });

  } catch (error) {
    console.error('Error updating AI configuration:', error);
    return NextResponse.json({ error: 'Failed to update AI configuration' }, { status: 500 });
  }
}
