// apps/game-ai-genkit/src/flows/errorEntitySpawner.ts
'use server';
/**
 * @fileOverview Genkit flow for designing and "spawning" (defining) special Error Entities.
 * These entities are manifestations of instability or direct AI interventions.
 */
import { ai } from '../../../game-ai-genkit/genkit'; // Adjusted path
import { z } from 'genkit';

export const ErrorEntitySpawnerInputSchema = z.object({
  targetZoneId: z.string().describe("The ID of the zone where the Error Entity will manifest."),
  zoneStatus: z.object({
    controllingFaction: z.string().optional().describe("ID of the faction currently controlling the zone (e.g., AICore, Hacker, Neutral)."),
    stabilityIndex: z.number().min(0).max(1).describe("Current stability of the zone (0=chaotic, 1=stable)."),
    recentConflictLevel: z.enum(["none", "low", "medium", "high", "critical"]).describe("Level of recent PvP/PvE conflict in the zone."),
    dominantPlayerLevel: z.number().int().min(1).optional().describe("Average or dominant player level in this zone, if known."),
  }).describe("Current status of the target zone."),
  triggerReason: z.string().max(200).describe("Reason for spawning this entity (e.g., 'Prolonged faction stalemate in Zone X', 'Anomalous data surge detected near Nexus Conduit Y', 'AI Core intervention to destabilize Hacker stronghold', 'Player action Z caused unforeseen system instability')."),
  entityTier: z.enum(["minor_glitch", "data_corruption_node", "nexus_anomaly_guardian", "system_error_reaver", "rogue_subroutine_alpha"]).default("data_corruption_node")
    .describe("The power tier or conceptual type of Error Entity to spawn."),
  desiredRole: z.enum(["area_denial", "player_harassment", "objective_blocker", "resource_drain", "faction_structure_attacker", "lore_dispenser_cryptic"]).optional()
    .describe("What tactical role should this Error Entity fulfill?"),
});
export type ErrorEntitySpawnerInput = z.infer<typeof ErrorEntitySpawnerInputSchema>;

export const ErrorEntitySchema = z.object({
    entityId: z.string().describe("Unique ID for this spawned Error Entity instance (e.g., ERR_{{{targetZoneId}}}_{{{entityTier}}}_{{timestamp_ms}})."),
    name: z.string().describe("A thematic and evocative name for this type of Error Entity (e.g., 'Fragmented Skitter', 'Null-Byte Worm', 'Aegis Breaker', 'Echoing Paradox')."),
    description: z.string().describe("Lore-rich description of the entity, its appearance, and its apparent purpose or nature within the Quantum Nexus."),
    tier: z.string().describe("The tier matching the input (e.g., 'minor_glitch', 'data_corruption_node')."),
    baseStats: z.object({ 
        power: z.number().int().min(10).describe("Core HP. Scale according to tier and zone player level."),
        memory: z.number().int().min(0).describe("Mental HP / Resource pool. Can be low for simple entities."),
        firewall: z.number().int().min(0).describe("Defense. Higher for tougher tiers."),
        ghz: z.number().int().min(1).describe("Attack power. Scale with tier."),
    }).describe("Base combat statistics for the entity."),
    specialAbilities: z.array(z.object({
        name: z.string().describe("Name of the ability."),
        description: z.string().describe("Effect of the ability (e.g., 'Teleports erratically', 'Drains Memory from nearby entities', 'Creates a temporary field of corrupted data slowing players')."),
        type: z.enum(["offensive_direct_damage", "offensive_debuff", "defensive_shield", "defensive_evasion", "utility_area_effect", "utility_summon_minion", "disruption_system_glitch"]).optional().describe("Categorization of the ability type."),
        cooldownTurns: z.number().int().optional().describe("Number of turns or seconds for cooldown if applicable."),
    })).min(1).max(3).describe("List of 1 to 3 special abilities or behaviors."),
    behaviorPattern: z.string().describe("Primary behavior (e.g., 'Aggressively targets faction structures in its vicinity', 'Hunts entities with high GHZ, ignoring others', 'Passively spreads data corruption, weakening defenses of nearby objects', 'Patrols a specific sub-region and attacks on sight'). Should align with desiredRole."),
    spawnLocationHint: z.string().optional().describe("Suggested area or condition for its appearance within the zone (e.g., 'Near corrupted data nodes', 'At the site of a recent major battle', 'Guarding a specific chokepoint')."),
    weaknesses: z.array(z.string()).optional().describe("Known weaknesses or vulnerabilities that players might discover or exploit (e.g., 'Vulnerable to AICore cleansing protocols', 'Disrupted by Hacker decryption spikes', 'Specific energy type deals bonus damage')."),
    rewardsOnDefeat: z.array(z.string()).optional().describe("Potential rewards for defeating this entity (e.g., 'Rare Data Fragments', 'Unique Code Snippet for Protocol Fork', 'Temporary Zone Buff')."),
    visualConcept: z.string().optional().describe("A brief description of its visual appearance to guide potential art generation (e.g., 'A swirling vortex of glitched code with exposed, sparking conduits', 'A crystalline entity pulsating with unstable light', 'A shadowy figure that flickers in and out of reality')."),
});
export type ErrorEntity = z.infer<typeof ErrorEntitySchema>;


const errorEntitySpawnerPrompt = ai.definePrompt({
  name: 'errorEntitySpawnerPrompt',
  input: { schema: ErrorEntitySpawnerInputSchema },
  output: { schema: ErrorEntitySchema },
  prompt: `You are an AI responsible for designing and spawning unique Error Entities in the game "Data Evolved".
These entities are manifestations of instability, direct AI interventions, or consequences of player actions within the Quantum Nexus.

Target Zone: {{{targetZoneId}}}
Zone Status:
- Controlling Faction: {{{zoneStatus.controllingFaction | default "Neutral"}}}
- Stability Index: {{{zoneStatus.stabilityIndex}}} (0=chaotic, 1=stable)
- Recent Conflict Level: {{{zoneStatus.recentConflictLevel}}}
- Dominant Player Level: {{{zoneStatus.dominantPlayerLevel | default "Unknown"}}}

Spawning Reason: {{{triggerReason}}}
Error Entity Tier/Type: {{{entityTier}}}
Desired Role: {{{desiredRole | default "General Disruption"}}}

Design a unique Error Entity fitting these conditions:
- 'entityId': Generate a unique ID (e.g., ERR_{{{targetZoneId}}}_{{{entityTier}}}_{{timestamp_ms}}).
- 'name': A thematic name.
- 'description': Lore-rich description of its appearance and nature.
- 'tier': Match the input tier.
- 'baseStats': Define Power, Memory, Firewall, GHZ appropriate for its tier, the zone's player level, and its role.
- 'specialAbilities': List 1-3 special abilities (name, description, type).
- 'behaviorPattern': Describe its primary behavior, aligning with its desired role.
- 'spawnLocationHint' (optional): Suggest where/how it appears.
- 'weaknesses' (optional): Suggest vulnerabilities.
- 'rewardsOnDefeat' (optional): Suggest potential rewards.
- 'visualConcept' (optional): Brief visual description.

The entity should feel like a natural yet disruptive part of the game's lore and mechanics. It should present a challenge or alter gameplay in the target zone.
Ensure stats are scaled reasonably. For example, a 'minor_glitch' might have low stats, while a 'system_error_reaver' would be very powerful.
`,
});

export const spawnErrorEntityFlow = ai.defineFlow(
  {
    name: 'spawnErrorEntityFlow',
    inputSchema: ErrorEntitySpawnerInputSchema,
    outputSchema: ErrorEntitySchema,
  },
  async (input) => {
    console.log(`Spawning Error Entity of tier ${input.entityTier} in zone ${input.targetZoneId} due to: ${input.triggerReason}`);
    const augmentedInput = { ...input, timestamp_ms: Date.now() }; // Add timestamp for unique ID generation in prompt
    const { output } = await errorEntitySpawnerPrompt(augmentedInput);
    if (!output) {
        throw new Error("Error Entity spawner failed to produce an output.");
    }
    // Ensure ID format
    if (!output.entityId || !output.entityId.startsWith("ERR_")) {
        output.entityId = `ERR_${input.targetZoneId}_${input.entityTier.substring(0,10).replace(/_/g,'')}_${Date.now()}`;
    }
    // Ensure tier matches input
    output.tier = input.entityTier;
    return output;
  }
);

export async function spawnErrorEntity(input: ErrorEntitySpawnerInput): Promise<ErrorEntity> {
  return spawnErrorEntityFlow(input);
}

console.log("Genkit Flow for Error Entity Spawner (apps/game-ai-genkit/src/flows/errorEntitySpawner.ts) loaded.");
