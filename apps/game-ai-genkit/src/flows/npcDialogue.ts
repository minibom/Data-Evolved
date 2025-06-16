// apps/game-ai-genkit/src/flows/npcDialogue.ts
'use server';
/**
 * @fileOverview Genkit flow for generating NPC dialogue.
 */
import { ai } from '../../../game-ai-genkit/genkit'; // Adjusted path
import { z } from 'genkit';

// Input schema for the NPC dialogue flow
export const NpcDialogueInputSchema = z.object({
  npcId: z.string().describe("The unique identifier of the NPC."),
  npcName: z.string().optional().describe("The name of the NPC for context."),
  npcPersonality: z.string().describe("A brief description of the NPC's personality traits, role, and current emotional state if known."),
  playerContext: z.string().describe("Information about the player interacting with the NPC (e.g., faction, recent actions, quest status, items held, reputation with NPC/faction)."),
  conversationHistory: z.array(z.object({ speaker: z.enum(["npc", "player"]), line: z.string() })).max(10).optional().describe("Previous lines in the current conversation (max 10 lines)."),
  desiredOutcome: z.string().optional().describe("Optional: What the NPC hopes to achieve with this dialogue (e.g., give a quest, share information, react to player, trade)."),
  currentZone: z.string().optional().describe("The current zone the interaction is happening in, for environmental context."),
  worldTime: z.string().optional().describe("Current in-game time or time of day, if relevant."),
});
export type NpcDialogueInput = z.infer<typeof NpcDialogueInputSchema>;

// Output schema for the NPC dialogue flow
export const NpcDialogueOutputSchema = z.object({
  dialogueLine: z.string().describe("The generated line of dialogue for the NPC. It should be natural and in character."),
  mood: z.enum(["neutral", "friendly", "hostile", "suspicious", "curious", "informative", "urgent", "scared", "amused", "sad"]).optional().describe("The NPC's current mood or tone reflected in the dialogue."),
  followUpOptions: z.array(
      z.object({
          optionId: z.string().describe("A unique ID for this player option (e.g., 'ask_about_anomaly', 'accept_quest_alpha')."),
          text: z.string().describe("Text for the player's dialogue option (keep it concise)."),
          leadsToQuestId: z.string().optional().describe("If selecting this option starts or progresses a quest, provide the Quest ID."),
          triggersEvent: z.string().optional().describe("If this option triggers a specific game event or NPC behavior change."),
      })
  ).max(4).optional().describe("Up to 4 suggested dialogue options for the player to respond with. Options should allow for meaningful interaction."),
  npcActionSuggestion: z.string().optional().describe("A suggestion for a non-verbal action the NPC might take (e.g., 'NPC hands over an item', 'NPC looks around nervously', 'NPC points towards the old ruins'). This is for the game engine to interpret."),
});
export type NpcDialogueOutput = z.infer<typeof NpcDialogueOutputSchema>;

// Define the Genkit prompt for NPC dialogue
const npcDialoguePrompt = ai.definePrompt({
  name: 'npcDialoguePrompt',
  input: { schema: NpcDialogueInputSchema },
  output: { schema: NpcDialogueOutputSchema },
  prompt: `You are an advanced AI controlling NPC interactions in the game "Data Evolved".
Your task is to generate a single, engaging, and contextually relevant dialogue line for an NPC, along with potential player follow-up options.

NPC Details:
- ID: {{{npcId}}}
- Name: {{{npcName | default "Unknown NPC"}}}
- Personality & Role: {{{npcPersonality}}}

Player Context: {{{playerContext}}}

{{#if currentZone}}Current Zone: {{{currentZone}}}{{/if}}
{{#if worldTime}}Current Time: {{{worldTime}}}{{/if}}

{{#if conversationHistory.length}}
Conversation History (last lines):
{{#each conversationHistory}}
- {{speaker}}: {{line}}
{{/each}}
{{/if}}

{{#if desiredOutcome}}
NPC's Desired Outcome for this line: {{{desiredOutcome}}}
{{/if}}

Based on all the above, generate the NPC's next dialogue line.
Ensure the dialogue is consistent with the NPC's personality and the current situation.
The dialogue should be natural and immersive.
Suggest an appropriate 'mood' for the NPC.
Provide 1-3 relevant 'followUpOptions' for the player. Each option should have an 'optionId' and 'text'.
Optionally, suggest an 'npcActionSuggestion' if a non-verbal action is appropriate.
Do not make the NPC omniscient. Their knowledge should be limited by their role and experiences.
Avoid generic greetings unless it's the start of a conversation.
`,
});

// Define the Genkit flow for NPC dialogue generation
export const generateNpcDialogueFlow = ai.defineFlow(
  {
    name: 'generateNpcDialogueFlow',
    inputSchema: NpcDialogueInputSchema,
    outputSchema: NpcDialogueOutputSchema,
  },
  async (input) => {
    console.log("Generating NPC dialogue for:", input.npcId, "Named:", input.npcName || "Unknown");
    const { output } = await npcDialoguePrompt(input);
    if (!output) {
        throw new Error("NPC dialogue generation failed to produce an output.");
    }
    // Ensure followUpOptions have unique IDs if generated by LLM without them
    if (output.followUpOptions) {
        output.followUpOptions = output.followUpOptions.map((opt, index) => ({
            ...opt,
            optionId: opt.optionId || `opt_${Date.now()}_${index}`
        }));
    }
    return output;
  }
);

// Exported wrapper function for ease of use
export async function generateNpcDialogue(input: NpcDialogueInput): Promise<NpcDialogueOutput> {
  return generateNpcDialogueFlow(input);
}

console.log("Genkit Flow for NPC Dialogue (apps/game-ai-genkit/src/flows/npcDialogue.ts) loaded.");
