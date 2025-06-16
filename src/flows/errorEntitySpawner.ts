// src/flows/errorEntitySpawner.ts
'use server';
/**
 * @fileOverview Genkit flow for simulating and spawning special Error Entities.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ErrorEntitySpawnerInputSchema = z.object({
  targetZoneId: z.string().describe("The ID of the zone where the Error Entity will manifest."),
  zoneStatus: z.object({
    controllingFaction: z.string().optional().describe("ID of the faction currently controlling the zone."),
    stabilityIndex: z.number().min(0).max(1).describe("Current stability of the zone (0=chaotic, 1=stable)."),
    recentConflictLevel: z.enum(["low", "medium", "high", "critical"]).describe("Level of recent PvP/PvE conflict."),
  }).describe("Current status of the target zone."),
  triggerReason: z.string().describe("Reason for spawning this entity (e.g., 'Prolonged faction stalemate', 'Anomalous data surge detected', 'AI Core intervention to destabilize dominant faction')."),
  entityTier: z.enum(["minor_glitch", "data_corruption", "nexus_anomaly", "system_error_reaver"]).default("data_corruption")
    .describe("The power tier or type of Error Entity to spawn."),
});
export type ErrorEntitySpawnerInput = z.infer<typeof ErrorEntitySpawnerInputSchema>;

export const ErrorEntitySchema = z.object({
    entityId: z.string().describe("Unique ID for this spawned Error Entity instance."),
    name: z.string().describe("A name for this type of Error Entity (e.g., 'Fragmented Skitter', 'Null-Byte Worm', 'Aegis Breaker')."),
    description: z.string().describe("Lore description of the entity and its appearance."),
    tier: z.string().describe("The tier matching the input."),
    baseStats: z.object({ // Example stats, align with game's combat system
        power: z.number().int(),
        memory: z.number().int(),
        firewall: z.number().int(),
        ghz: z.number().int(),
    }),
    specialAbilities: z.array(z.object({
        name: z.string(),
        description: z.string().describe("Effect of the ability."),
        type: z.enum(["offensive", "defensive", "utility", "disruption"]).optional(),
    })).min(1).describe("List of special abilities."),
    behaviorPattern: z.string().describe("Primary behavior (e.g., 'Aggressively targets faction structures', 'Hunts entities with high GHZ', 'Spreads data corruption, weakening defenses')."),
    spawnLocationHint: z.string().optional().describe("Suggested area or condition for its appearance within the zone."),
    weaknesses: z.array(z.string()).optional().describe("Known weaknesses (e.g., 'Vulnerable to AICore cleansing protocols', 'Disrupted by Hacker decryption spikes')."),
    rewardsOnDefeat: z.string().optional().describe("Potential rewards for defeating this entity."),
});
export type ErrorEntity = z.infer<typeof ErrorEntitySchema>;


const errorEntitySpawnerPrompt = ai.definePrompt({
  name: 'errorEntitySpawnerPrompt',
  input: { schema: ErrorEntitySpawnerInputSchema },
  output: { schema: ErrorEntitySchema },
  prompt: `You are an AI responsible for designing and spawning unique Error Entities in "Data Evolved".
These entities are manifestations of instability or direct interventions within the Quantum Nexus.

Target Zone: {{{targetZoneId}}}
Zone Status:
- Controlling Faction: {{{zoneStatus.controllingFaction | default "Neutral"}}}
- Stability Index: {{{zoneStatus.stabilityIndex}}}
- Recent Conflict: {{{zoneStatus.recentConflictLevel}}}

Spawning Reason: {{{triggerReason}}}
Error Entity Tier/Type: {{{entityTier}}}

Design a unique Error Entity fitting these conditions.
- Generate a unique ID (e.g., ERR_{{{targetZoneId}}}_{{{entityTier}}}_{{timestamp_ms}}).
- Give it a thematic name and description.
- Define its base combat stats (Power, Memory, Firewall, GHZ) appropriate for its tier and the zone's status.
- List 1-3 special abilities with names and descriptions.
- Describe its primary behavior pattern and how it interacts with the zone or other entities.
- Optionally, suggest weaknesses or specific rewards for defeating it.
The entity should feel like a natural part of the game's lore and mechanics.
`,
});

export const spawnErrorEntityFlow = ai.defineFlow(
  {
    name: 'spawnErrorEntityFlow',
    inputSchema: ErrorEntitySpawnerInputSchema,
    outputSchema: ErrorEntitySchema,
  },
  async (input) => {
    console.log(`Spawning Error Entity of tier ${input.entityTier} in zone ${input.targetZoneId}`);
    const augmentedInput = { ...input, timestamp_ms: Date.now() };
    const { output } = await errorEntitySpawnerPrompt(augmentedInput);
    if (!output) {
        throw new Error("Error Entity spawner failed to produce an output.");
    }
    if (!output.entityId || !output.entityId.startsWith("ERR_")) {
        output.entityId = `ERR_${input.targetZoneId}_${input.entityTier}_${Date.now()}`;
    }
    return output;
  }
);

export async function spawnErrorEntity(input: ErrorEntitySpawnerInput): Promise<ErrorEntity> {
  return spawnErrorEntityFlow(input);
}

console.log("Genkit Flow for Error Entity Spawner (src/flows/errorEntitySpawner.ts) loaded.");
