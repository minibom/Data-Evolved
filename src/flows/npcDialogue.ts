// src/flows/npcDialogue.ts
'use server';
/**
 * @fileOverview Genkit flow for generating NPC dialogue.
 */
import { ai } from '@/ai/genkit'; // Assuming ai/genkit.ts is the central Genkit config
import { z } from 'genkit';

// Input schema for the NPC dialogue flow
export const NpcDialogueInputSchema = z.object({
  npcId: z.string().describe("The unique identifier of the NPC."),
  npcPersonality: z.string().describe("A brief description of the NPC's personality traits and role."),
  playerContext: z.string().describe("Information about the player interacting with the NPC (e.g., faction, recent actions, quest status)."),
  conversationHistory: z.array(z.object({ speaker: z.enum(["npc", "player"]), line: z.string() })).optional().describe("Previous lines in the current conversation."),
  desiredOutcome: z.string().optional().describe("Optional: What the NPC hopes to achieve with this dialogue (e.g., give a quest, share information, react to player)."),
});
export type NpcDialogueInput = z.infer<typeof NpcDialogueInputSchema>;

// Output schema for the NPC dialogue flow
export const NpcDialogueOutputSchema = z.object({
  dialogueLine: z.string().describe("The generated line of dialogue for the NPC."),
  mood: z.string().optional().describe("The NPC's current mood or tone (e.g., friendly, suspicious, urgent)."),
  followUpOptions: z.array(z.string()).optional().describe("Suggested dialogue options for the player to respond with."),
});
export type NpcDialogueOutput = z.infer<typeof NpcDialogueOutputSchema>;

// Define the Genkit prompt for NPC dialogue
const npcDialoguePrompt = ai.definePrompt({
  name: 'npcDialoguePrompt',
  input: { schema: NpcDialogueInputSchema },
  output: { schema: NpcDialogueOutputSchema },
  prompt: `You are an advanced AI controlling NPC interactions in the game "Data Evolved".
Your task is to generate a single, engaging, and contextually relevant dialogue line for an NPC.

NPC Details:
- ID: {{{npcId}}}
- Personality & Role: {{{npcPersonality}}}

Player Context: {{{playerContext}}}

{{#if conversationHistory.length}}
Conversation History (last 5 lines):
{{#each conversationHistory}}
- {{speaker}}: {{line}}
{{/each}}
{{/if}}

{{#if desiredOutcome}}
NPC's Desired Outcome for this line: {{{desiredOutcome}}}
{{/if}}

Based on all the above, generate the NPC's next dialogue line.
Ensure the dialogue is consistent with the NPC's personality and the current situation.
If appropriate, suggest a mood and potential follow-up options for the player.`,
});

// Define the Genkit flow for NPC dialogue generation
export const generateNpcDialogueFlow = ai.defineFlow(
  {
    name: 'generateNpcDialogueFlow',
    inputSchema: NpcDialogueInputSchema,
    outputSchema: NpcDialogueOutputSchema,
  },
  async (input) => {
    console.log("Generating NPC dialogue for:", input.npcId);
    const { output } = await npcDialoguePrompt(input);
    if (!output) {
        throw new Error("NPC dialogue generation failed to produce an output.");
    }
    return output;
  }
);

// Exported wrapper function for ease of use
export async function generateNpcDialogue(input: NpcDialogueInput): Promise<NpcDialogueOutput> {
  return generateNpcDialogueFlow(input);
}

console.log("Genkit Flow for NPC Dialogue (src/flows/npcDialogue.ts) loaded.");
