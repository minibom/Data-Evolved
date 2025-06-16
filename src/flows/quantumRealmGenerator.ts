// src/flows/quantumRealmGenerator.ts
'use server';
/**
 * @fileOverview Genkit flow for generating details of temporary Quantum Realms.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const QuantumRealmInputSchema = z.object({
  triggeringEvent: z.object({
    type: z.enum(["major_player_failure", "critical_faction_loss", "unexpected_system_cascade", "experimental_ai_action"]),
    description: z.string().describe("Detailed description of the event that triggered the realm's creation."),
    involvedEntities: z.array(z.string()).optional().describe("IDs of players or factions primarily involved."),
  }).describe("The event that led to the formation of this Quantum Realm."),
  baseZoneId: z.string().optional().describe("If based on an existing zone, its ID. Otherwise, it's a purely conceptual realm."),
  realmTheme: z.string().describe("A core theme for this realm (e.g., 'Fragmented Memories', 'Corrupted Data Fortress', 'Echoes of a Lost Timeline', 'Unstable Probability Engine')."),
  durationCategory: z.enum(["short_lived", "temporary_persistent", "conditional_collapse"]).describe("Expected duration or collapse condition."),
});
export type QuantumRealmInput = z.infer<typeof QuantumRealmInputSchema>;

export const QuantumRealmOutputSchema = z.object({
  realmId: z.string().describe("Unique ID for this Quantum Realm instance."),
  name: z.string().describe("An evocative name for this Quantum Realm."),
  description: z.string().describe("A rich textual description of the realm's appearance, atmosphere, and nature."),
  entryConditions: z.string().optional().describe("How entities can enter this realm (e.g., 'Through a data rift near Zone X', 'By activating a specific artifact')."),
  exitConditions: z.string().describe("How entities can exit, or what causes the realm to collapse (e.g., 'Defeat the Realm Guardian', 'Stabilize the core data stream', 'Realm collapses after 1 hour')."),
  uniqueMechanics: z.array(z.string()).optional().describe("Any special rules or mechanics active within this realm (e.g., 'Gravity is inverted', 'Digital abilities are amplified', 'Time flows erratically')."),
  keyFeatures: z.array(z.string()).optional().describe("Notable locations, entities, or challenges within the realm."),
  potentialRewards: z.string().optional().describe("Unique rewards or consequences for navigating this realm."),
  loreSnippet: z.string().optional().describe("A short piece of lore related to this realm's existence."),
});
export type QuantumRealmOutput = z.infer<typeof QuantumRealmOutputSchema>;


const quantumRealmGeneratorPrompt = ai.definePrompt({
  name: 'quantumRealmGeneratorPrompt',
  input: { schema: QuantumRealmInputSchema },
  output: { schema: QuantumRealmOutputSchema },
  prompt: `You are a Quantum Realm Architect AI for "Data Evolved".
Your task is to design a temporary, unstable Quantum Realm that has formed due to a significant in-game event.

Triggering Event:
- Type: {{{triggeringEvent.type}}}
- Description: {{{triggeringEvent.description}}}
{{#if triggeringEvent.involvedEntities.length}}- Involved Entities: {{#each triggeringEvent.involvedEntities}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

{{#if baseZoneId}}Realm Foundation: Based on Zone ID {{{baseZoneId}}}{{/if}}
Realm Theme: {{{realmTheme}}}
Expected Duration/Collapse Condition: {{{durationCategory}}}

Generate the details for this Quantum Realm. It should feel like a twisted, temporary pocket dimension within the Quantum Nexus.
Provide a unique ID (e.g., QR_{{{triggeringEvent.type}}}_{{timestamp_ms}}), a name, a vivid description, entry/exit conditions, and any unique mechanics or key features.
What unique rewards or knowledge could be gained here? Include a brief lore snippet about its ephemeral existence.
The realm should be challenging but offer unique opportunities.
`,
});

export const generateQuantumRealmFlow = ai.defineFlow(
  {
    name: 'generateQuantumRealmFlow',
    inputSchema: QuantumRealmInputSchema,
    outputSchema: QuantumRealmOutputSchema,
  },
  async (input) => {
    console.log("Quantum Realm Generator: Designing realm based on event:", input.triggeringEvent.type);
    const augmentedInput = { ...input, timestamp_ms: Date.now() };
    const { output } = await quantumRealmGeneratorPrompt(augmentedInput);
     if (!output) {
        throw new Error("Quantum Realm generation failed to produce an output.");
    }
    if (!output.realmId || !output.realmId.startsWith("QR_")) {
        output.realmId = `QR_${input.triggeringEvent.type.substring(0,10)}_${Date.now()}`;
    }
    return output;
  }
);

export async function generateQuantumRealm(input: QuantumRealmInput): Promise<QuantumRealmOutput> {
  return generateQuantumRealmFlow(input);
}

console.log("Genkit Flow for Quantum Realm Generation (src/flows/quantumRealmGenerator.ts) loaded.");
