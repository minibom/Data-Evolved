// apps/game-ai-genkit/src/flows/dynamicQuest.ts
'use server';
/**
 * @fileOverview Genkit flow for generating dynamic quests.
 */
import { ai } from '../../../game-ai-genkit/genkit'; // Adjusted path
import { z } from 'genkit';

// Input schema for dynamic quest generation
export const DynamicQuestInputSchema = z.object({
  playerLevel: z.number().int().min(1).describe("Player's current level."),
  playerFaction: z.enum(["AICore", "Hacker", "Neutral"]).optional().describe("Player's faction, if any."),
  currentZoneId: z.string().describe("The ID of the zone where the quest might be generated or take place."),
  zoneData: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      controllingFaction: z.string().optional(),
      storyThemes: z.array(z.string()).optional().describe("Key story themes or ongoing events in the current zone."),
      availableNpcIds: z.array(z.string()).optional().describe("List of NPC IDs present in or relevant to the zone."),
      availableEnemyTypes: z.array(z.string()).optional().describe("List of enemy types commonly found in the zone."),
      availableItemTypes: z.array(z.string()).optional().describe("List of item types that can be found or are relevant to the zone."),
  }).optional().describe("Detailed information about the current zone."),
  recentPlayerActions: z.array(z.string()).max(5).optional().describe("Summary of up to 5 significant recent player actions (e.g., 'defeated boss X', 'explored area Y', 'helped NPC Z')."),
  questDifficulty: z.enum(["easy", "medium", "hard", "epic"]).optional().default("medium").describe("Desired difficulty of the quest."),
  questStylePreference: z.enum(["combat", "collection", "exploration", "puzzle", "social", "mixed"]).optional().default("mixed").describe("Player's preferred quest style or a style fitting the context."),
});
export type DynamicQuestInput = z.infer<typeof DynamicQuestInputSchema>;

// Output schema for a dynamic quest
export const QuestObjectiveSchema = z.object({
  description: z.string().describe("Text description of the objective for the player to read."),
  type: z.enum(["kill", "collect", "reach_location", "interact_object", "escort_npc", "scan_target", "defend_point", "use_item_on_target", "solve_puzzle_step"])
    .describe("Type of objective."),
  targetId: z.string().optional().describe("ID of the target entity (enemy type, NPC ID), item type, specific object instance ID, or location name/ID."),
  targetName: z.string().optional().describe("Display name of the target (e.g., 'Corrupted Drone', 'Data Crystal', 'Abandoned Terminal')."),
  targetCount: z.number().int().min(1).optional().default(1).describe("Number of targets to achieve (e.g., kill 5 drones, collect 3 crystals)."),
  locationHint: z.string().optional().describe("Hint about where to find the target or complete the objective (e.g., 'Sector Gamma', 'Near the old comms tower')."),
  relatedNpcId: z.string().optional().describe("If this objective involves a specific NPC (e.g., escort, report to).")
});

export const QuestRewardSchema = z.object({
  xp: z.number().int().optional().describe("Experience points rewarded."),
  currency: z.record(z.number().int()).optional().describe("Currency rewarded (e.g., { dataShards: 100 }). Keys should be currency IDs."),
  items: z.array(z.object({ itemId: z.string().describe("ID of the item definition."), quantity: z.number().int().min(1) })).optional().describe("Items rewarded."),
  factionStanding: z.array(z.object({ factionId: z.string(), amount: z.number().int() })).optional().describe("Changes in faction standing (positive or negative)."),
  unlocksQuestId: z.string().optional().describe("ID of a follow-up quest unlocked upon completion."),
  titleOrRank: z.string().optional().describe("A special title or rank awarded to the player."),
});

export const DynamicQuestOutputSchema = z.object({
  questId: z.string().describe("A unique ID generated for this quest (e.g., DYNQST_{{{currentZoneId}}}_{{{playerLevel}}}_{{timestamp_ms}})."),
  title: z.string().describe("The title of the quest, should be engaging and reflect the quest's theme."),
  description: z.string().describe("A detailed description of the quest's backstory, purpose, and what the player needs to do. Should be immersive."),
  giverId: z.string().optional().describe("ID of the NPC or system entity giving the quest. Can be 'SystemBroadcast' or an NPC ID from zoneData.availableNpcIds."),
  objectives: z.array(QuestObjectiveSchema).min(1).max(3).describe("List of 1 to 3 objectives to complete the quest. Objectives should be clear and actionable."),
  rewards: QuestRewardSchema.describe("Rewards for completing the quest. Rewards should be appropriate for the difficulty and player level."),
  timeLimitMinutes: z.number().int().optional().describe("Optional time limit for the quest in minutes."),
  isFactionQuest: z.boolean().default(false).describe("Is this quest specific to a faction?"),
  requiredFactionId: z.string().optional().describe("If a faction quest, the ID of the required faction (e.g., AICore, Hacker). Should match playerFaction if specified in input."),
  suggestedLevel: z.number().int().optional().describe("Suggested player level for this quest, can be same as playerLevel or slightly higher for challenge."),
  loreSnippet: z.string().optional().describe("A small piece of lore or context related to this quest."),
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
{{#if zoneData.name}}- Zone Name: {{{zoneData.name}}}{{/if}}
{{#if zoneData.description}}- Zone Description: {{{zoneData.description}}}{{/if}}
{{#if zoneData.controllingFaction}}- Zone Control: {{{zoneData.controllingFaction}}}{{/if}}
{{#if zoneData.storyThemes.length}}- Zone Themes: {{#each zoneData.storyThemes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if zoneData.availableNpcIds.length}}- NPCs in Zone: {{#each zoneData.availableNpcIds}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if zoneData.availableEnemyTypes.length}}- Enemies in Zone: {{#each zoneData.availableEnemyTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if zoneData.availableItemTypes.length}}- Items in Zone: {{#each zoneData.availableItemTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if recentPlayerActions.length}}- Recent Player Actions: {{#each recentPlayerActions}}{{{this}}}{{#unless @last}}; {{/unless}}{{/each}}{{/if}}
- Desired Difficulty: {{{questDifficulty}}}
- Preferred Style: {{{questStylePreference}}}

Based on this information, design a new quest.
- Generate a unique questId (e.g., DYNQST_{{{currentZoneId}}}_{{{playerLevel}}}_{{timestamp_ms}}).
- Create an engaging title and a rich, immersive description.
- If possible, assign a giverId from zoneData.availableNpcIds or use 'SystemBroadcast'.
- Define 1-3 clear, actionable objectives using types like 'kill', 'collect', 'reach_location', 'interact_object'. Specify targetId (e.g., enemy type, item type), targetName (display name), targetCount, and locationHint.
- Design balanced rewards (xp, currency, items, faction standing).
- Determine if it's a faction quest and specify requiredFactionId if so (should align with playerFaction or Neutral).
- Suggest a player level. Add a loreSnippet for flavor.
- The quest should feel logically connected to the zone, player actions, or ongoing events.
- Ensure rewards are scaled to the difficulty and player level.
`,
});

export const generateDynamicQuestFlow = ai.defineFlow(
  {
    name: 'generateDynamicQuestFlow',
    inputSchema: DynamicQuestInputSchema,
    outputSchema: DynamicQuestOutputSchema,
  },
  async (input) => {
    console.log("Generating dynamic quest for zone:", input.currentZoneId, "Player Lvl:", input.playerLevel);
    const augmentedInput = { ...input, timestamp_ms: Date.now() }; // Add timestamp for unique ID generation in prompt
    const { output } = await dynamicQuestPrompt(augmentedInput);
     if (!output) {
        throw new Error("Dynamic quest generation failed to produce an output.");
    }
    // Ensure a unique ID is truly set, if not generated perfectly by LLM
    if (!output.questId || !output.questId.startsWith("DYNQST_")) {
        output.questId = `DYNQST_${input.currentZoneId}_${input.playerLevel}_${Date.now()}`;
    }
    if (output.isFactionQuest && !output.requiredFactionId && input.playerFaction !== "Neutral") {
        output.requiredFactionId = input.playerFaction;
    }
    if (!output.suggestedLevel) {
        output.suggestedLevel = input.playerLevel;
    }
    return output;
  }
);

export async function generateDynamicQuest(input: DynamicQuestInput): Promise<DynamicQuestOutput> {
  return generateDynamicQuestFlow(input);
}

console.log("Genkit Flow for Dynamic Quest Generation (apps/game-ai-genkit/src/flows/dynamicQuest.ts) loaded.");
