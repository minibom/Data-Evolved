// src/flows/combatStrategy.ts
'use server';
/**
 * @fileOverview Genkit flow for providing combat strategy advice or controlling AI enemy behavior.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const CombatStrategyInputSchema = z.object({
  entityId: z.string().describe("ID of the entity (player or AI) needing strategy."),
  entityType: z.enum(["player", "enemy_npc", "boss"]).describe("Type of the entity."),
  entityStats: z.object({
    power: z.number(), memory: z.number(), firewall: z.number(), ghz: z.number(),
  }).describe("Current combat stats of the entity."),
  entitySkills: z.array(z.string()).optional().describe("List of available skills/abilities."),
  opponentIds: z.array(z.string()).describe("IDs of the opponent(s)."),
  opponentStats: z.array(z.object({
    id: z.string(), power: z.number(), memory: z.number(), firewall: z.number(), ghz: z.number(), type: z.string().optional(),
  })).describe("Stats of the opponent(s)."),
  combatSituation: z.string().optional().describe("Brief description of the current combat situation (e.g., outnumbered, low health, target escaping)."),
});
export type CombatStrategyInput = z.infer<typeof CombatStrategyInputSchema>;

export const CombatStrategyOutputSchema = z.object({
  suggestedAction: z.string().describe("The primary recommended action (e.g., 'Use Skill: GlitchStrike on target X', 'Focus fire on weakest enemy', 'Activate Defensive Protocol')."),
  reasoning: z.string().optional().describe("Explanation for the suggested action."),
  targetPriority: z.string().optional().describe("Recommended target ID, if applicable."),
  confidence: z.number().min(0).max(1).optional().describe("AI's confidence in this strategy (0-1)."),
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
- Stats: Power: {{{entityStats.power}}}, Memory: {{{entityStats.memory}}}, Firewall: {{{entityStats.firewall}}}, GHZ: {{{entityStats.ghz}}}
{{#if entitySkills.length}}- Skills: {{#each entitySkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

Opponent(s):
{{#each opponentStats}}
- ID: {{{this.id}}} (Type: {{{this.type}}}) - Stats: P:{{{this.power}}}, M:{{{this.memory}}}, F:{{{this.firewall}}}, G:{{{this.ghz}}}
{{/each}}

{{#if combatSituation}}Current Situation: {{{combatSituation}}}{{/if}}

Suggest the best action. Consider survival, efficiency, and exploiting weaknesses.
If suggesting a skill, specify which skill and on which target.
If the entity is an AI, the action should be direct and executable.
If the entity is a player, the advice can be more strategic.
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
    return output;
  }
);

export async function getCombatStrategy(input: CombatStrategyInput): Promise<CombatStrategyOutput> {
  return getCombatStrategyFlow(input);
}

console.log("Genkit Flow for Combat Strategy (src/flows/combatStrategy.ts) loaded.");
