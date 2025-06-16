// apps/game-ai-genkit/src/flows/quantumRealmGenerator.ts
'use server';
/**
 * @fileOverview Genkit flow for generating details of temporary, unstable Quantum Realms.
 * These realms are often triggered by significant game events like major player failures,
 * critical faction losses, or unexpected AI interventions, creating unique, short-lived challenges.
 */
import { ai } from '../../../game-ai-genkit/genkit'; // Adjusted path
import { z } from 'genkit';

export const QuantumRealmInputSchema = z.object({
  realmIdSuggestion: z.string().optional().describe("A suggested base for the realm ID (e.g., from the triggering event ID)."),
  triggeringEvent: z.object({
    type: z.enum([
        "major_player_group_wipe_in_raid",
        "critical_faction_objective_failure",
        "catastrophic_system_error_cascade",
        "rogue_ai_experiment_misfire",
        "ancient_data_structure_destabilization",
        "player_activated_forbidden_protocol"
    ]).describe("The specific type of critical event that triggered the realm's formation."),
    description: z.string().describe("Detailed description of the event, including location, involved entities, and immediate consequences."),
    involvedEntities: z.array(z.string()).optional().describe("IDs of players, factions, or significant NPCs primarily involved or affected by the event."),
    eventSeverity: z.enum(["high", "critical", "cataclysmic"]).default("critical").describe("Severity of the triggering event."),
  }).describe("The event that led to the formation of this Quantum Realm."),
  baseZoneId: z.string().optional().describe("If the realm is a twisted version of an existing zone, provide its ID. Otherwise, it's a purely conceptual, unanchored realm."),
  realmTheme: z.string().describe("A core theme for this realm, influencing its aesthetics, inhabitants, and challenges (e.g., 'Fragmented Player Memories', 'Corrupted AI Core Subroutine', 'Echoes of a Lost Timeline', 'Unstable Probability Engine', 'Data-Starved Void')."),
  expectedDurationCategory: z.enum(["short_lived_ birkaç_hours", "temporary_persistent_days", "conditional_collapse_player_action_needed"]).describe("Expected duration or general collapse condition category."),
  difficultyTier: z.enum(["challenging", "very_hard", "near_impossible"]).default("very_hard").describe("Intended difficulty for players entering this realm."),
});
export type QuantumRealmInput = z.infer<typeof QuantumRealmInputSchema>;

export const QuantumRealmOutputSchema = z.object({
  realmId: z.string().describe("Unique ID for this Quantum Realm instance (e.g., QR_{{{triggeringEvent.type}}}_{{{difficultyTier}}}_{{timestamp_ms}})."),
  name: z.string().describe("An evocative and thematic name for this Quantum Realm."),
  ambianceDescription: z.string().describe("A rich textual description of the realm's appearance, atmosphere, sensory details (sounds, visual distortions), and overall feeling."),
  entryMechanisms: z.array(z.string()).min(1).describe("How entities can enter this realm (e.g., 'Through a shimmering data rift near the event epicenter in Zone X', 'By activating a specific corrupted artifact found on the defeated boss', 'Automatically pulled in if within proximity during realm formation')."),
  exitConditions: z.array(z.string()).min(1).describe("How entities can exit, or what causes the realm to collapse permanently (e.g., 'Defeat the Realm Guardian entity', 'Stabilize the central data stream by solving three paradox-puzzles', 'Realm collapses after 24 real-world hours', 'Find and activate the exit portal')."),
  uniqueMechanics: z.array(
    z.object({
      name: z.string().describe("Name of the unique mechanic."),
      description: z.string().describe("How this mechanic affects gameplay within the realm."),
    })
  ).optional().describe("Any special rules, physics, or gameplay mechanics active only within this realm (e.g., 'Gravity is inverted periodically', 'Digital abilities have unpredictable side-effects', 'Time flows erratically, affecting cooldowns', 'Data Scraps decay rapidly unless stored in shielded containers')."),
  keyFeaturesAndEncounters: z.array(
    z.object({
      featureType: z.enum(["landmark", "puzzle_element", "unique_enemy_spawn", "resource_node_rare", "lore_object", "trap_hazard", "temporary_buff_shrine"]).describe("Type of feature or encounter."),
      name: z.string().optional().describe("Name of the feature/encounter."),
      description: z.string().describe("Description of the feature/encounter and its relevance."),
      locationHint: z.string().optional().describe("General area or condition for finding it."),
    })
  ).min(1).describe("List of 2-5 notable locations, entities, puzzles, or challenges within the realm."),
  potentialRewards: z.array(
    z.object({
      rewardType: z.enum(["unique_item", "large_resource_cache", "temporary_powerful_buff_outside_realm", "lore_revelation", "skill_unlock_rare", "cosmetic_trophy"]).describe("Type of reward."),
      description: z.string().describe("Description of the reward."),
      rarity: z.enum(["uncommon", "rare", "epic", "legendary"]).optional(),
    })
  ).optional().describe("Unique rewards, knowledge, or consequences for successfully navigating or completing objectives within this realm."),
  loreSnippet: z.string().optional().describe("A short piece of evocative lore related to this realm's ephemeral existence or the event that caused it."),
  collapseWarningSigns: z.array(z.string()).optional().describe("Observable signs that the realm is becoming unstable or nearing collapse."),
});
export type QuantumRealmOutput = z.infer<typeof QuantumRealmOutputSchema>;


const quantumRealmGeneratorPrompt = ai.definePrompt({
  name: 'quantumRealmGeneratorPrompt',
  input: { schema: QuantumRealmInputSchema },
  output: { schema: QuantumRealmOutputSchema },
  prompt: `You are a Quantum Realm Architect AI for the game "Data Evolved".
Your task is to design a temporary, unstable Quantum Realm that has formed due to a significant in-game event. This realm is a pocket dimension, a glitch in the fabric of the Quantum Nexus.

Realm ID Suggestion: {{{realmIdSuggestion}}}
Triggering Event:
- Type: {{{triggeringEvent.type}}}
- Description: {{{triggeringEvent.description}}}
{{#if triggeringEvent.involvedEntities.length}}- Involved Entities: {{#each triggeringEvent.involvedEntities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Severity: {{{triggeringEvent.eventSeverity}}}

{{#if baseZoneId}}Realm Foundation: Potentially a twisted version of Zone ID {{{baseZoneId}}}{{/if}}
Realm Theme: {{{realmTheme}}}
Expected Duration/Collapse Category: {{{expectedDurationCategory}}}
Intended Difficulty: {{{difficultyTier}}}

Generate the details for this Quantum Realm:
- 'realmId': Create a unique ID (e.g., QR_{{{triggeringEvent.type}}}_{{{difficultyTier}}}_{{timestamp_ms}}).
- 'name': An evocative name.
- 'ambianceDescription': Vividly describe its appearance, atmosphere, sounds, and feel.
- 'entryMechanisms': How to enter (at least one).
- 'exitConditions': How to leave or what makes it collapse (at least one).
- 'uniqueMechanics' (optional): 1-2 special rules or physics.
- 'keyFeaturesAndEncounters': 2-5 notable locations, entities, puzzles, or challenges.
- 'potentialRewards' (optional): Unique rewards for success.
- 'loreSnippet' (optional): A brief, intriguing piece of lore.
- 'collapseWarningSigns' (optional): How players know it's ending.

The realm should be challenging, thematically consistent, and offer unique experiences reflecting its chaotic, temporary nature.
`,
});

export const generateQuantumRealmFlow = ai.defineFlow(
  {
    name: 'generateQuantumRealmFlow',
    inputSchema: QuantumRealmInputSchema,
    outputSchema: QuantumRealmOutputSchema,
  },
  async (input) => {
    console.log("Quantum Realm Generator: Designing realm based on event:", input.triggeringEvent.type, "Theme:", input.realmTheme);
    const augmentedInput = { ...input, timestamp_ms: Date.now() };
    const { output } = await quantumRealmGeneratorPrompt(augmentedInput);
     if (!output) {
        throw new Error("Quantum Realm generation failed to produce an output.");
    }
    if (!output.realmId || !output.realmId.startsWith("QR_")) {
        output.realmId = `QR_${input.triggeringEvent.type.substring(0,10).replace(/_/g,'')}_${input.difficultyTier.substring(0,3).toUpperCase()}_${Date.now()}`;
    }
    return output;
  }
);

export async function generateQuantumRealm(input: QuantumRealmInput): Promise<QuantumRealmOutput> {
  return generateQuantumRealmFlow(input);
}

console.log("Genkit Flow for Quantum Realm Generation (apps/game-ai-genkit/src/flows/quantumRealmGenerator.ts) loaded.");
