import { NextRequest, NextResponse } from 'next/server';
import { aiCoreDirective, AICoreDirectiveInput } from '@/ai/flows/ai-core-directive';
import { anonymousDirective, AnonymousDirectiveInput } from '@/ai/flows/anonymous-directive';
import type { AIFactionName } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const factionName = body.factionName as AIFactionName;
    const gameState = body.gameState as string || "The game world is stable, player population is moderate. The Nexus hub is bustling with trade activity.";
    const factionGoals = body.factionGoals as string;

    if (!factionName) {
      return NextResponse.json({ error: 'Faction name is required (AICore or Anonymous)' }, { status: 400 });
    }

    let result;
    let rawOutput;

    if (factionName === 'AICore') {
      const input: AICoreDirectiveInput = {
        gameState,
        factionGoals: factionGoals || "Maintain system stability, optimize resource distribution, and enhance player engagement through structured events."
      };
      result = await aiCoreDirective(input);
      rawOutput = result;
    } else if (factionName === 'Anonymous') {
      const input: AnonymousDirectiveInput = {
        gameState,
        factionGoals: factionGoals || "Inject chaos, disrupt established systems, create unpredictable scenarios, and challenge dominant player strategies."
      };
      result = await anonymousDirective(input);
      rawOutput = result;
    } else {
      return NextResponse.json({ error: 'Invalid faction name' }, { status: 400 });
    }

    // Persist the directive (e.g., by calling the ai-directives API or directly to DB)
    // For now, we'll just return it.
    // In a real scenario, this would likely POST to /api/admin/ai-directives
    // or save to Firestore and then the admin panel would read from there.

    const newDirectiveForLog = {
        factionName,
        directive: result.directive,
        explanation: (result as any).explanation, // Optional for Anonymous
        rawOutput,
      };

    // Simulate saving by POSTing to our mock ai-directives API
    const logResponse = await fetch(new URL('/api/admin/ai-directives', request.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDirectiveForLog),
    });

    if (!logResponse.ok) {
        console.error("Failed to log new directive:", await logResponse.text());
        // Decide if this should be a hard error or just a warning
    }
    
    const loggedDirective = await logResponse.json();


    return NextResponse.json(loggedDirective);

  } catch (error: any) {
    console.error('Error in AI Orchestrator:', error);
    return NextResponse.json({ error: 'Failed to generate AI directive', details: error.message || String(error) }, { status: 500 });
  }
}
