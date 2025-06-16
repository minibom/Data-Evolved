// apps/game-ai-genkit/src/flows/worldEventGenerator.ts
'use server';
/**
 * @fileOverview Genkit flow for generating dynamic world events.
 */
import { ai } from '../../../game-ai-genkit/genkit'; // Adjusted path
import { z } from 'genkit';

export const WorldEventGeneratorInputSchema = z.object({
  currentWorldState: z.string().describe("A summary of the current game world state, including faction tensions (e.g., AICore 60%, Hacker 40%), resource levels (e.g., DataScraps abundant, EnergyCells scarce), active anomalies, and recent major player achievements or failures."),
  triggeringFaction: z.enum(["AICore", "Anonymous", "System_Anomaly", "Player_Impact"]).optional().describe("Which major AI faction, systemic anomaly, or significant player impact is potentially triggering this event. 'System_Anomaly' for random chaotic events, 'Player_Impact' for events as consequences of collective player actions."),
  desiredImpact: z.string().optional().describe("Optional: A desired high-level impact for the event (e.g., 'Increase faction conflict in Zone X', 'Introduce a new resource scarcity in Digital Forest', 'Create a collaborative PvE challenge for players level 10-15', 'Shift narrative towards Hacker uncovering AI Core secret')."),
  eventIntensity: z.enum(["minor_local", "moderate_regional", "major_zone_wide", "critical_global"]).default("moderate_regional").describe("The desired intensity or scale of the event."),
  eventDurationHint: z.enum(["short_burst", "few_hours", "one_day", "multi_day_campaign", "persistent_until_resolved"]).default("few_hours").describe("A hint for the event's duration."),
  targetZoneIds: z.array(z.string()).optional().describe("Specific Zone IDs this event could target, if applicable. If empty, it might be global or choose zones dynamically."),
  playerLevelRange: z.object({ min: z.number().int(), max: z.number().int() }).optional().describe("Suggested player level range this event is most relevant for."),
});
export type WorldEventGeneratorInput = z.infer<typeof WorldEventGeneratorInputSchema>;

export const WorldEventSchema = z.object({
    eventId: z.string().describe("Unique ID for the event (e.g., WRLDEVT_{{{eventIntensity}}}_{{{type}}}_{{timestamp_ms}})."),
    name: z.string().describe("Catchy and thematic name for the event."),
    description: z.string().describe("In-depth description of the event, its cause, and its potential effects on the game world and players. Should be engaging and provide context."),
    type: z.enum([
        "global_buff_debuff", // Affects all players or specific factions globally
        "zone_environmental_change", // e.g., data storm, corrupted terrain
        "resource_surge_or_scarcity", // Affects availability of certain resources
        "npc_behavior_shift", // NPCs act differently, offer new quests, or migrate
        "enemy_incursion_or_anomaly_spawn", // New or stronger enemies appear
        "boss_event_trigger", // Triggers a specific world boss spawn or activity
        "narrative_lore_reveal", // Uncovers new lore or progresses a story arc
        "faction_conflict_escalation_or_opportunity", // Directly impacts faction warfare
        "puzzle_or_mystery_event", // Introduces a new puzzle or mystery for players to solve
        "player_challenge_event", // A specific challenge for players (e.g., defend a point, escort VIP)
    ]).describe("The primary type of world event."),
    durationMinutes: z.number().int().min(5).optional().describe("For timed events, estimated duration in minutes. Some events might be persistent until resolved by player actions."),
    affectedZones: z.array(z.string()).optional().describe("IDs of zones primarily affected by this event. Can be global if empty or not applicable."),
    targetPlayerDescription: z.string().optional().describe("Description of which players this event primarily targets or is most relevant to (e.g., 'All players in Zone Alpha', 'Members of Hacker faction', 'Players level 10-20')."),
    activationConditions: z.string().optional().describe("Conditions under which the event activates or becomes visible (e.g., 'Immediately', 'When Zone X stability drops below 30%', 'After AI Core completes Directive Y')."),
    resolutionConditions: z.string().optional().describe("How the event concludes or is resolved (e.g., 'After duration expires', 'When players complete objective Z', 'If Faction A captures Point B')."),
    positiveEffects: z.array(z.string()).optional().describe("Potential positive outcomes or rewards for players/factions."),
    negativeEffects: z.array(z.string()).optional().describe("Potential negative consequences or challenges for players/factions."),
    parameters: z.record(z.any()).optional().describe("Specific parameters for this event, e.g., { bossId: '...', buffStat: 'GHZ', buffValue: 0.1, targetResource: 'data_scrap_rare', changePercent: -0.5 }."),
    loreIntegration: z.string().optional().describe("How this event ties into the ongoing narrative or lore of Data Evolved. Make it intriguing."),
});
export type WorldEvent = z.infer<typeof WorldEventSchema>;


const worldEventGeneratorPrompt = ai.definePrompt({
  name: 'worldEventGeneratorPrompt',
  input: { schema: WorldEventGeneratorInputSchema },
  output: { schema: WorldEventSchema },
  prompt: `You are a World Event Designer AI for "Data Evolved".
Your task is to create a new, dynamic world event based on the provided context.

Current World State: {{{currentWorldState}}}
{{#if triggeringFaction}}Event Trigger Source: {{{triggeringFaction}}}{{/if}}
{{#if desiredImpact}}Desired Impact: {{{desiredImpact}}}{{/if}}
Event Intensity: {{{eventIntensity}}}
Event Duration Hint: {{{eventDurationHint}}}
{{#if targetZoneIds.length}}Suggested Target Zones: {{#each targetZoneIds}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if playerLevelRange}}Suggested Player Level Range: {{{playerLevelRange.min}}}-{{{playerLevelRange.max}}}{{/if}}

Design an event with:
- A unique 'eventId' (e.g., WRLDEVT_{{{eventIntensity}}}_{{{type}}}_{{timestamp_ms}} - you will decide the 'type').
- A compelling 'name'.
- A rich 'description' of the event, its cause, and potential effects.
- A clear 'type' from the available enum.
- Estimated 'durationMinutes' if applicable (based on durationHint).
- 'affectedZones' (IDs, can be derived from targetZoneIds or be global if none specified).
- 'targetPlayerDescription' outlining who is most affected.
- 'activationConditions' and 'resolutionConditions'.
- Potential 'positiveEffects' and 'negativeEffects'.
- Specific 'parameters' relevant to the event type (e.g., for resource_surge_or_scarcity, specify 'targetResource' and 'changePercent').
- Intriguing 'loreIntegration'.

The event should feel like a natural consequence of the world state or AI faction actions.
Ensure the event makes sense within the game's themes of data, AI, and digital conflict.
If no targetZoneIds are provided, you can choose a zone or make it global based on context.
`,
});


export const generateWorldEventFlow = ai.defineFlow(
  {
    name: 'generateWorldEventFlow',
    inputSchema: WorldEventGeneratorInputSchema,
    outputSchema: WorldEventSchema,
  },
  async (input) => {
    console.log("Generating world event, triggered by:", input.triggeringFaction || "System_Anomaly or Player_Impact");
    const augmentedInput = { ...input, timestamp_ms: Date.now() }; // Add timestamp for unique ID generation in prompt
    const { output } = await worldEventGeneratorPrompt(augmentedInput);
    if (!output) {
        throw new Error("World event generation failed to produce an output.");
    }
    if (!output.eventId || !output.eventId.startsWith("WRLDEVT_")) {
        // Construct a more descriptive ID if LLM fails to generate one properly
        const typePart = output.type ? output.type.substring(0,10).toUpperCase().replace(/_/g,'') : "GENERIC";
        output.eventId = `WRLDEVT_${input.eventIntensity.substring(0,3).toUpperCase()}_${typePart}_${Date.now()}`;
    }
    return output;
  }
);

export async function generateWorldEvent(input: WorldEventGeneratorInput): Promise<WorldEvent> {
  return generateWorldEventFlow(input);
}

console.log("Genkit Flow for World Event Generation (apps/game-ai-genkit/src/flows/worldEventGenerator.ts) loaded.");
