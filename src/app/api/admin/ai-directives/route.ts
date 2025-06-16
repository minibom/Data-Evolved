import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { AIDirective } from '@/types';

// Mock data store
let mockDirectives: AIDirective[] = [
  {
    id: 'core-001',
    factionName: 'AICore',
    directive: 'Deploy defensive subroutines in Zone Alpha to stabilize data fluctuations.',
    explanation: 'Increased player activity in Zone Alpha is causing minor data instability. Defensive subroutines will mitigate this and ensure a smooth experience while subtly guiding players towards resource nodes.',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: 'active',
    rawOutput: { directive: 'Deploy defensive subroutines in Zone Alpha to stabilize data fluctuations.', explanation: 'Increased player activity in Zone Alpha is causing minor data instability. Defensive subroutines will mitigate this and ensure a smooth experience while subtly guiding players towards resource nodes.'}
  },
  {
    id: 'anon-001',
    factionName: 'Anonymous',
    directive: 'Inject a rogue data packet into the Global Market API, causing temporary price scrambles for non-essential goods.',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    status: 'active',
    rawOutput: { directive: 'Inject a rogue data packet into the Global Market API, causing temporary price scrambles for non-essential goods.'}
  },
  {
    id: 'core-002',
    factionName: 'AICore',
    directive: 'Initiate a system-wide integrity check. Reward players participating in identifying anomalies.',
    explanation: 'Routine maintenance combined with an opportunity for player engagement. This fosters a sense of contribution and helps maintain system health.',
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    status: 'archived',
    rawOutput: { directive: 'Initiate a system-wide integrity check. Reward players participating in identifying anomalies.', explanation: 'Routine maintenance combined with an opportunity for player engagement. This fosters a sense of contribution and helps maintain system health.'}
  },
];

export async function GET(request: NextRequest) {
  // In a real app, you'd fetch from Firestore or other DB
  return NextResponse.json(mockDirectives);
}

export async function POST(request: NextRequest) {
  try {
    const newDirectiveData = await request.json();
    // Basic validation (in real app, use Zod)
    if (!newDirectiveData.factionName || !newDirectiveData.directive || !newDirectiveData.rawOutput) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newDirective: AIDirective = {
      id: `${newDirectiveData.factionName.toLowerCase()}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending_review',
      ...newDirectiveData,
    };
    
    mockDirectives.unshift(newDirective); // Add to the beginning
    mockDirectives = mockDirectives.slice(0, 50); // Keep only latest 50

    return NextResponse.json(newDirective, { status: 201 });
  } catch (error) {
    console.error("Error processing new directive:", error);
    return NextResponse.json({ error: 'Failed to process new directive' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const directiveIndex = mockDirectives.findIndex(d => d.id === id);
    if (directiveIndex === -1) {
      return NextResponse.json({ error: 'Directive not found' }, { status: 404 });
    }

    mockDirectives[directiveIndex].status = status;
    return NextResponse.json(mockDirectives[directiveIndex]);

  } catch (error) {
    console.error("Error updating directive status:", error);
    return NextResponse.json({ error: 'Failed to update directive status' }, { status: 500 });
  }
}
