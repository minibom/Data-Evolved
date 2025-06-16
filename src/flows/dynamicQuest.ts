// src/flows/dynamicQuest.ts
'use server';
/**
 * @fileOverview Genkit flow for generating dynamic quests.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for dynamic quest generation
export const DynamicQuestInputSchema = z.object({
  playerLevel: z.number().int().min(1).describe("Player's current level."),
  playerFaction: z.enum(["AICore", "Hacker", "Neutral"]).optional().describe("Player's faction, if any."),
  currentZoneId: z.string().describe("The ID of the zone where the quest might be generated or take place."),
  zoneStoryThemes: z.array(z.string()).optional().describe("Key story themes or ongoing events in the current zone."),
  recentPlayerActions: z.array(z.string()).optional().describe("Summary of significant recent player actions."),
  questDifficulty: z.enum(["easy", "medium", "hard"]).optional().default("medium").describe("Desired difficulty of the quest."),
});
export type DynamicQuestInput = z.infer<typeof DynamicQuestInputSchema>;

// Output schema for a dynamic quest
export const QuestObjectiveSchema = z.object({
  description: z.string().describe("Text description of the objective."),
  type: z.enum(["kill", "collect", "reach", "interact", "escort", "scan", "defend"]).describe("Type of objective."),
  targetId: z.string().optional().describe("ID of the target entity, item, or location."),
  targetCount: z.number().int().min(1).optional().describe("Number of targets to achieve."),
});

export const QuestRewardSchema = z.object({
  xp: z.number().int().optional().describe("Experience points rewarded."),
  currency: z.record(z.number().int()).optional().describe("Currency rewarded (e.g., { dataShards: 100 })."),
  items: z.array(z.object({ itemId: z.string(), quantity: z.number().int() })).optional().describe("Items rewarded."),
  factionStanding: z.array(z.object({ factionId: z.string(), amount: z.number() })).optional().describe("Changes in faction standing."),
});

export const DynamicQuestOutputSchema = z.object({
  questId: z.string().describe("A unique ID generated for this quest."),
  title: z.string().describe("The title of the quest."),
  description: z.string().describe("A detailed description of the quest's backstory and purpose."),
  giverId: z.string().optional().describe("ID of the NPC or system entity giving the quest."),
  objectives: z.array(QuestObjectiveSchema).min(1).describe("List of objectives to complete the quest."),
  rewards: QuestRewardSchema.describe("Rewards for completing the quest."),
  timeLimitMinutes: z.number().int().optional().describe("Optional time limit for the quest in minutes."),
  isFactionQuest: z.boolean().default(false).describe("Is this quest specific to a faction?"),
  requiredFactionId: z.string().optional().describe("If a faction quest, the ID of the required faction."),
});
export type DynamicQuestOutput = z.infer<typeof DynamicQuestOutputSchema>;


const dynamicQuestPrompt = ai.definePrompt({
  name: 'dynamicQuestPrompt',
  input: { schema: DynamicQuestInputSchema },
  output: { schema: DynamicQuestOutputSchema },
  prompt: `You are a Quest Designer AI for the game "Data Evolved".
Your goal is to generate a compelling and contextually appropriate dynamic quest.

Player Information:
- Level: {{{playerLevel}}}
{{#if playerFaction}}- Faction: {{{playerFaction}}}{{/if}}

Quest Context:
- Zone ID: {{{currentZoneId}}}
{{#if zoneStoryThemes.length}}- Zone Themes: {{#each zoneStoryThemes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if recentPlayerActions.length}}- Recent Player Actions: {{#each recentPlayerActions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Desired Difficulty: {{{questDifficulty}}}

Based on this information, design a new quest. The quest should have a clear title, an engaging description, 1-3 objectives, and balanced rewards.
If relevant, make it a faction quest. Ensure the quest ID is unique (e.g., dynQuest_{{{currentZoneId}}}_{{{playerLevel}}}_{{timestamp_ms}}).
The objectives should be actionable (e.g., "Defeat 5 Corrupted Drones in Sector Gamma", "Collect 3 Encrypted Data Chips from AI Core terminals", "Scan the Anomaly at coordinates X,Y").
Rewards should be appropriate for the difficulty and player level.
`,
});

export const generateDynamicQuestFlow = ai.defineFlow(
  {
    name: 'generateDynamicQuestFlow',
    inputSchema: DynamicQuestInputSchema,
    outputSchema: DynamicQuestOutputSchema,
  },
  async (input) => {
    console.log("Generating dynamic quest for zone:", input.currentZoneId);
    // Add timestamp to input for more unique ID generation if needed by prompt, or generate ID here.
    const augmentedInput = { ...input, timestamp_ms: Date.now() };
    const { output } = await dynamicQuestPrompt(augmentedInput);
     if (!output) {
        throw new Error("Dynamic quest generation failed to produce an output.");
    }
    // Ensure a unique ID is truly set, if not generated perfectly by LLM
    if (!output.questId || !output.questId.startsWith("dynQuest_")) {
        output.questId = `dynQuest_${input.currentZoneId}_${input.playerLevel}_${Date.now()}`;
    }
    return output;
  }
);

export async function generateDynamicQuest(input: DynamicQuestInput): Promise<DynamicQuestOutput> {
  return generateDynamicQuestFlow(input);
}

console.log("Genkit Flow for Dynamic Quest Generation (src/flows/dynamicQuest.ts) loaded.");
