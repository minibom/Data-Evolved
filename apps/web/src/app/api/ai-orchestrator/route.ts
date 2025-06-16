import { NextRequest, NextResponse } from 'next/server';
import { aiCoreDirective } from '@game-ai-flows/ai-core-directive';
import { anonymousDirective } from '@game-ai-flows/anonymous-directive';
import type { AIFactionName, AIDirective } from '@packages/common-types/aiFaction';
import type { AICoreDirectiveInput, AICoreDirectiveOutput, AnonymousDirectiveInput, AnonymousDirectiveOutput } from '@packages/common-types/aiFlowTypes';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const factionName = body.factionName as AIFactionName;
    const gameState = body.gameState as string || "The game world is stable, player population is moderate. The Nexus hub is bustling with trade activity.";
    const factionGoals = body.factionGoals as string;

    if (!factionName) {
      return NextResponse.json({ error: 'Faction name is required (AICore or Anonymous)' }, { status: 400 });
    }

    let result: AICoreDirectiveOutput | AnonymousDirectiveOutput;
    let rawOutput: AICoreDirectiveOutput | AnonymousDirectiveOutput;

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
    
    const newDirectiveForLog = {
        factionName,
        directive: result.directive,
        explanation: (result as AICoreDirectiveOutput).explanation, // Explanation is only in AICoreDirectiveOutput
        rawOutput,
      };

    // Construct the full URL for the internal API call
    const host = request.headers.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const logApiUrl = new URL('/api/admin/ai-directives', `${protocol}://${host}`);

    const logResponse = await fetch(logApiUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDirectiveForLog),
    });

    if (!logResponse.ok) {
        console.error("Failed to log new directive:", await logResponse.text());
    }
    
    const loggedDirective = await logResponse.json();

    return NextResponse.json(loggedDirective);

  } catch (error: any) {
    console.error('Error in AI Orchestrator:', error);
    return NextResponse.json({ error: 'Failed to generate AI directive', details: error.message || String(error) }, { status: 500 });
  }
}
