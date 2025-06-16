// apps/game-ai-genkit/src/flows/combatStrategy.ts
'use server';
/**
 * @fileOverview Genkit flow for providing combat strategy advice or controlling AI enemy behavior.
 */
import { ai } from '../../../game-ai-genkit/genkit'; // Adjusted path
import { z } from 'genkit';

// Define a more detailed Skill schema for input
const CombatSkillSchema = z.object({
  id: z.string().describe("Unique ID of the skill."),
  name: z.string().describe("Name of the skill."),
  type: z.enum(["attack", "defense", "buff", "debuff", "utility", "heal"]).describe("Type of skill."),
  targetType: z.enum(["self", "single_enemy", "single_ally", "aoe_enemy", "aoe_ally"]).describe("Who the skill can target."),
  resourceCost: z.number().optional().describe("Cost in Memory or other resource to use the skill."),
  cooldownTurns: z.number().int().optional().describe("Number of turns before it can be used again."),
  isReady: z.boolean().default(true).describe("Is the skill currently off cooldown and usable?"),
  description: z.string().optional().describe("Brief description of what the skill does."),
});

export const CombatStrategyInputSchema = z.object({
  entityId: z.string().describe("ID of the entity (player or AI) needing strategy."),
  entityType: z.enum(["player", "enemy_npc", "boss_npc"]).describe("Type of the entity."),
  entityStats: z.object({
    power: z.number().int().describe("Current Power (Core HP)."),
    maxPower: z.number().int().describe("Maximum Power."),
    memory: z.number().int().describe("Current Memory (Mental HP/Resource)."),
    maxMemory: z.number().int().describe("Maximum Memory."),
    firewall: z.number().int().describe("Current Firewall (Defense)."),
    ghz: z.number().int().describe("Current GHZ (Attack Power)."),
    activeEffects: z.array(z.string()).optional().describe("List of active status effects on the entity (e.g., 'stunned', 'firewall_debuff')."),
  }).describe("Current combat stats and status of the entity."),
  entitySkills: z.array(CombatSkillSchema).optional().describe("List of available skills/abilities for the entity, including their readiness."),
  opponents: z.array(z.object({
    id: z.string().describe("Unique ID of the opponent."),
    type: z.string().optional().describe("Type of opponent (e.g., 'CorruptedDrone', 'AICoreSentinel', 'PlayerEntity')."),
    power: z.number().int().describe("Opponent's current Power."),
    maxPower: z.number().int().describe("Opponent's maximum Power."),
    firewall: z.number().int().describe("Opponent's Firewall."),
    ghz: z.number().int().describe("Opponent's GHZ."),
    isTargetingEntity: z.boolean().optional().describe("Is this opponent currently targeting our entity?"),
    activeEffects: z.array(z.string()).optional().describe("List of active status effects on the opponent."),
    distance: z.enum(["melee", "short_range", "medium_range", "long_range"]).optional().describe("Estimated distance to this opponent."),
  })).min(1).describe("Stats and status of the opponent(s)."),
  combatSituation: z.string().optional().describe("Brief description of the current combat situation (e.g., 'outnumbered 2v1', 'low health on primary target', 'boss enraged', 'player is escaping')."),
  turnNumber: z.number().int().min(1).optional().describe("Current turn number in combat, if turn-based."),
  environmentFactors: z.array(z.string()).optional().describe("Any environmental factors affecting combat (e.g., 'low_visibility_data_fog', 'nexus_energy_surge_buffs_ghz')."),
});
export type CombatStrategyInput = z.infer<typeof CombatStrategyInputSchema>;

export const CombatStrategyOutputSchema = z.object({
  suggestedAction: z.string().describe("The primary recommended action (e.g., 'Use Skill: GlitchStrike on target EnemyDrone_A', 'Focus fire on Opponent_Weakest', 'Activate Defensive Protocol: AegisShield', 'Move to cover behind Debris_1')."),
  reasoning: z.string().describe("Detailed explanation for why this action is tactically sound, considering entity stats, opponent weaknesses, available skills, and the overall situation."),
  targetPriorityId: z.string().optional().describe("Recommended target Opponent ID, if applicable. This should be one of the IDs from the input `opponents` array."),
  alternativeAction: z.string().optional().describe("A secondary or alternative action if the primary one is not feasible or if the situation changes slightly."),
  confidence: z.number().min(0).max(1).optional().default(0.8).describe("AI's confidence in this strategy (0-1)."),
  expectedOutcome: z.string().optional().describe("What the AI anticipates will happen if this action is taken."),
});
export type CombatStrategyOutput = z.infer<typeof CombatStrategyOutputSchema>;

const combatStrategyPrompt = ai.definePrompt({
  name: 'combatStrategyPrompt',
  input: { schema: CombatStrategyInputSchema },
  output: { schema: CombatStrategyOutputSchema },
  prompt: `You are a Combat AI Tactician for "Data Evolved".
Analyze the provided combat scenario and suggest the optimal next action for the entity.

Entity needing strategy:
- ID: {{{entityId}}} (Type: {{{entityType}}})
- Stats: Power: {{{entityStats.power}}}/{{{entityStats.maxPower}}}, Memory: {{{entityStats.memory}}}/{{{entityStats.maxMemory}}}, Firewall: {{{entityStats.firewall}}}, GHZ: {{{entityStats.ghz}}}
{{#if entityStats.activeEffects.length}}- Active Effects: {{#each entityStats.activeEffects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if entitySkills.length}}- Skills (Name, Type, Target, Cost, CD, Ready, Desc):
{{#each entitySkills}}  - {{name}} ({{type}}, {{targetType}}, Cost:{{resourceCost|default 'N/A'}}, CD:{{cooldownTurns|default 'N/A'}}, Ready:{{isReady}}, Desc:{{description|default 'N/A'}})
{{/each}}{{else}}- Skills: None listed{{/if}}

Opponent(s):
{{#each opponents}}
- ID: {{{id}}} (Type: {{{type|default 'Unknown'}}}) - P:{{{power}}}/{{{maxPower}}}, F:{{{firewall}}}, G:{{{ghz}}} {{#if distance}}(Dist: {{{distance}}}){{/if}} {{#if isTargetingEntity}}(Targeting Us!){{/if}} {{#if activeEffects.length}}(Effects: {{#each activeEffects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}){{/if}}
{{/each}}

{{#if combatSituation}}Current Situation: {{{combatSituation}}}{{/if}}
{{#if turnNumber}}Turn: {{{turnNumber}}}{{/if}}
{{#if environmentFactors.length}}Environment: {{#each environmentFactors}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

Suggest the best action. Consider survival, efficiency, and exploiting weaknesses.
- If suggesting a skill, specify its exact name and the ID of the target from the opponent list.
- If the entity is an AI (enemy_npc, boss_npc), the action should be direct and executable.
- If the entity is a player, the advice can be more strategic.
- Provide detailed reasoning, a target priority ID (if applicable), and an alternative action.
- Prioritize skills that are ready (isReady: true).
`,
});

export const getCombatStrategyFlow = ai.defineFlow(
  {
    name: 'getCombatStrategyFlow',
    inputSchema: CombatStrategyInputSchema,
    outputSchema: CombatStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await combatStrategyPrompt(input);
    if (!output) {
        throw new Error("Combat strategy generation failed to produce an output.");
    }
    // Validate targetPriorityId if provided
    if (output.targetPriorityId && !input.opponents.find(op => op.id === output.targetPriorityId)) {
        console.warn(`AI suggested targetPriorityId '${output.targetPriorityId}' not found in opponent list. Clearing it.`);
        output.targetPriorityId = undefined;
    }
    return output;
  }
);

export async function getCombatStrategy(input: CombatStrategyInput): Promise<CombatStrategyOutput> {
  return getCombatStrategyFlow(input);
}

console.log("Genkit Flow for Combat Strategy (apps/game-ai-genkit/src/flows/combatStrategy.ts) loaded.");
