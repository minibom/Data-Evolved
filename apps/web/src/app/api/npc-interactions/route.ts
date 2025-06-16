// apps/web/src/app/api/npc-interactions/route.ts
/**
 * This API route handles interactions with Non-Player Characters (NPCs).
 * It's responsible for:
 * - Receiving player interaction context.
 * - Calling the `npcDialogue` Genkit flow to generate NPC responses.
 * - Potentially triggering quest updates or other game events based on dialogue choices.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateNpcDialogue, type NpcDialogueInput, type NpcDialogueOutput } from '@game-ai-flows/npcDialogue';
// import { verifyUser } from '@/lib/auth'; // For player authentication
// import { updateQuestProgress } from '@/lib/db/firestore'; // Example of a DB interaction

export async function POST(request: NextRequest) {
  // const user = await verifyUser(request);
  // if (!user) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }
  // const playerId = user.uid;

  try {
    const interactionData: NpcDialogueInput = await request.json();

    // Validate input data (basic example)
    if (!interactionData.npcId || !interactionData.npcPersonality || !interactionData.playerContext) {
      return NextResponse.json({ error: 'Missing required interaction data' }, { status: 400 });
    }

    console.log(`API: NPC interaction received for NPC ${interactionData.npcId}`);

    // Call the Genkit flow to get the NPC's dialogue
    const dialogueOutput: NpcDialogueOutput = await generateNpcDialogue(interactionData);

    // Here, you might add logic based on the dialogue output:
    // - If the dialogue implies starting a quest: `startQuestForPlayer(playerId, questId)`
    // - If a player choice leads to an event: `triggerGameEvent(...)`
    // - If dialogue reveals info: store it for the player, etc.

    return NextResponse.json(dialogueOutput);

  } catch (error: any) {
    console.error('Error during NPC interaction:', error);
    return NextResponse.json({ error: 'Failed to process NPC interaction', details: error.message || String(error) }, { status: 500 });
  }
}
