// src/flows/worldEventGenerator.ts
'use server';
/**
 * @fileOverview Genkit flow for generating dynamic world events.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const WorldEventGeneratorInputSchema = z.object({
  currentWorldState: z.string().describe("A summary of the current game world state, including faction tensions, resource levels, and recent major events."),
  triggeringFaction: z.enum(["AICore", "Anonymous", "System"]).optional().describe("Which major AI faction (or System) is potentially triggering this event."),
  desiredImpact: z.string().optional().describe("Optional: A desired high-level impact for the event (e.g., 'Increase faction conflict in Zone X', 'Introduce a new resource scarcity', 'Create a collaborative challenge')."),
  eventIntensity: z.enum(["minor", "moderate", "major", "critical"]).default("moderate").describe("The desired intensity or scale of the event."),
});
export type WorldEventGeneratorInput = z.infer<typeof WorldEventGeneratorInputSchema>;

export const WorldEventSchema = z.object({
    eventId: z.string().describe("Unique ID for the event."),
    name: z.string().describe("Catchy name for the event."),
    description: z.string().describe("In-depth description of the event, its cause, and its potential effects on the game world and players."),
    type: z.enum(["global_buff", "zone_anomaly", "boss_spawn", "narrative_event", "resource_shift", "faction_conflict_escalation"])
      .describe("The type of world event."),
    durationMinutes: z.number().int().optional().describe("For timed events, duration in minutes. Some events might be persistent until resolved."),
    affectedZones: z.array(z.string()).optional().describe("IDs of zones primarily affected by this event. Can be global if empty."),
    // Event-specific parameters could be a flexible object
    parameters: z.record(z.any()).optional().describe("Specific parameters for this event, e.g., { bossId: '...', buffStat: 'GHZ', buffValue: 0.1 }."),
    loreIntegration: z.string().optional().describe("How this event ties into the ongoing narrative or lore of Data Evolved."),
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

Design an event with a unique ID (e.g., WRLDEVT_{{{eventIntensity}}}_{{timestamp_ms}}), a compelling name, a rich description, a clear type, and relevant parameters.
The event should feel like a natural consequence of the world state or AI faction actions.
If it's a narrative event, provide some lore integration.
Ensure the event makes sense within the game's themes of data, AI, and digital conflict.
Example parameters: for 'boss_spawn', include 'bossId' and 'spawnZoneId'. For 'global_buff', include 'buffEffectDescription' and 'targetFaction' (if any).
`,
});


export const generateWorldEventFlow = ai.defineFlow(
  {
    name: 'generateWorldEventFlow',
    inputSchema: WorldEventGeneratorInputSchema,
    outputSchema: WorldEventSchema,
  },
  async (input) => {
    console.log("Generating world event, triggered by:", input.triggeringFaction || "System");
    const augmentedInput = { ...input, timestamp_ms: Date.now() };
    const { output } = await worldEventGeneratorPrompt(augmentedInput);
    if (!output) {
        throw new Error("World event generation failed to produce an output.");
    }
    if (!output.eventId || !output.eventId.startsWith("WRLDEVT_")) {
        output.eventId = `WRLDEVT_${input.eventIntensity}_${Date.now()}`;
    }
    return output;
  }
);

export async function generateWorldEvent(input: WorldEventGeneratorInput): Promise<WorldEvent> {
  return generateWorldEventFlow(input);
}

console.log("Genkit Flow for World Event Generation (src/flows/worldEventGenerator.ts) loaded.");
