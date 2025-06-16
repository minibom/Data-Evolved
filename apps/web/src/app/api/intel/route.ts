// apps/web/src/app/api/intel/route.ts
/**
 * API Route for fetching game intelligence.
 * This intel can be AI-generated propaganda, strategic advice, world event summaries, etc.
 * It will call the `strategicIntel` Genkit flow.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getStrategicIntel, type StrategicIntelInput, type StrategicIntelOutput } from '@game-ai-flows/strategicIntel';
// import { verifyUser } from '@/lib/auth/server-auth'; // For player authentication
// import { getPlayerProfileFromDB, getCurrentWorldEventsFromDB, getFactionDirectivesFromDB } from '@/lib/db/firestore'; // Example DB interactions

export async function POST(request: NextRequest) { // Changed to POST to accept a richer input body
  // const user = await verifyUser(request);
  // if (!user) {
  //    return NextResponse.json({ error: 'Unauthorized. Player ID required for personalized intel.' }, { status: 401 });
  // }
  // const authedPlayerId = user.uid; // Use authenticated user ID

  try {
    const intelInput: StrategicIntelInput = await request.json();

    // if (intelInput.playerId !== authedPlayerId) { // Ensure request is for the authenticated user
    //     return NextResponse.json({ error: 'Forbidden. Cannot request intel for another player.' }, { status: 403 });
    // }
    
    // In a real scenario, some parts of intelInput.playerProfile and intelInput.currentWorldState
    // might be fetched/augmented server-side based on the authenticated playerId to prevent spoofing
    // and ensure data freshness, rather than solely relying on client-sent data.
    // For example, player level, GHZ, faction, active quests would be fetched from the DB.
    // Current world events and faction directives would also be fetched server-side.

    console.log(`API /api/intel: Requesting strategic intel for player ${intelInput.playerId}`);
    // console.log(`API /api/intel: Input to flow:`, JSON.stringify(intelInput, null, 2));

    const intelOutput: StrategicIntelOutput = await getStrategicIntel(intelInput);

    // Potentially save this generated intel to a player-specific log in Firestore
    // await savePlayerIntelLog(intelInput.playerId, intelOutput);

    return NextResponse.json(intelOutput);

  } catch (error: any) {
    console.error('API /api/intel: Error fetching strategic intel:', error);
    if (error.name === 'ZodError') { // Example for Zod validation error from Genkit flow
        return NextResponse.json({ error: 'Invalid input for strategic intel', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to generate strategic intel', details: error.message || String(error) }, { status: 500 });
  }
}

// GET could be used for simpler, non-personalized intel or general news feeds
// if such a feature is desired. For personalized strategic intel, POST with a body is more appropriate.
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const intelType = searchParams.get('type') || 'general_news'; // e.g., 'general_news', 'faction_status_AICore'

    if (intelType === 'general_news') {
        // Fetch or generate general game news (e.g., recent world events, major player achievements)
        // This might call a different, simpler Genkit flow or query a 'news' collection in DB.
        const mockGeneralNews = [
            { title: "Nexus Stability Fluctuating", message: "AI Core reports minor data stream instabilities in Zone Gamma. Entities are advised to proceed with caution.", timestamp: new Date().toISOString() },
            { title: "Hacker Collective Claims Responsibility for Market Glitch", message: "The Shadow Decoders have allegedly disrupted pricing algorithms on the Fragmented Marketplace. AI Core is investigating.", timestamp: new Date(Date.now() - 3600000).toISOString() }
        ];
        return NextResponse.json(mockGeneralNews);
    }
    return NextResponse.json({ error: "Invalid intel type requested or player-specific intel requires POST." }, { status: 400});
}
