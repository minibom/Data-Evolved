// apps/game-ai-genkit/src/flows/gameBalancer.ts
'use server';
/**
 * @fileOverview Genkit flow for AI Game Balancing.
 * This AI analyzes game metrics and player feedback to suggest or
 * automatically apply balancing changes to game rules, item stats,
 * or enemy parameters. Its goal is to maintain a fair, engaging, and healthy game ecosystem.
 */
import { ai } from '../../../game-ai-genkit/genkit'; // Adjusted path
import { z } from 'genkit';
// Assuming GlobalGameRules and other relevant types are defined in @packages/common-types
// For now, using placeholders.
// import type { GlobalGameRules } from '@packages/common-types/db';
// import type { ItemData, EnemyData } from '@packages/common-types/game'; // Example data structures for items/enemies

// Placeholder for actual types from @packages/common-types
type GlobalGameRules = Record<string, any>; // Example: { pvpDamageModifier: 1.0, commonScrapDropRate: 0.5 }
type ItemData = { id: string, name: string, type: string, stats: Record<string, any>, cost?: number };
type EnemyData = { id: string, name: string, type: string, stats: Record<string, any>, abilities?: string[], xpValue?: number };

export const GameBalancerInputSchema = z.object({
  gameplayMetrics: z.object({
    averagePlayerSessionLengthMinutes: z.number().optional().describe("Average player session length in minutes over the last N days."),
    playerRetentionRate7Day: z.number().min(0).max(1).optional().describe("7-day player retention rate."),
    factionWinLossRatioPvP: z.record(z.number()).optional().describe("Win/loss ratio for each faction pair in PvP (e.g., {'AICore_vs_Hacker': 0.55})."),
    factionZoneControlPercentage: z.record(z.number()).optional().describe("Percentage of total zones controlled by each faction."),
    itemUsageFrequency: z.array(z.object({ itemId: z.string(), usageRate: z.number().min(0).max(1) })).optional().describe("Usage frequency for a sample of key items."),
    enemyDefeatSuccessRate: z.array(z.object({ enemyId: z.string(), playerSuccessRate: z.number().min(0).max(1) })).optional().describe("Player success rate against specific challenging enemy types."),
    playerFeedbackSummary: z.string().optional().describe("AI-summarized qualitative player feedback on balance, difficulty, fairness, and specific game elements (e.g., 'Players find Hacker faction underpowered in late game', 'Item X is considered overpowered')."),
    economyHealthIndicators: z.object({
        averageCurrencyPerPlayer: z.number().optional(),
        resourceHotspotsDepletionRate: z.record(z.number()).optional().describe("Rate at which key resource nodes are depleted (zoneId_resourceId: rate)."),
    }).optional(),
  }).describe("Aggregated gameplay metrics and player feedback."),
  currentGlobalGameRules: z.custom<GlobalGameRules>().describe("The current set of global game rules affecting gameplay mechanics."),
  sampleItemStats: z.array(z.custom<ItemData>()).optional().describe("Current stats for a selection of key items that might need balancing."),
  sampleEnemyStats: z.array(z.custom<EnemyData>()).optional().describe("Current stats for a selection of key enemy types that might need balancing."),
  balanceGoals: z.array(z.string()).min(1).describe("Specific balancing goals for this cycle (e.g., 'Improve Hacker faction PvP viability by 5%', 'Reduce early-game difficulty spikes for new players', 'Increase usage of underutilized crafting recipes for utility items by 10%')."),
  historicalChanges: z.array(z.object({ changeDescription: z.string(), dateImplemented: z.string().datetime(), observedImpact: z.string().optional() })).optional().describe("Log of recent significant balance changes and their observed impact, if known."),
});
export type GameBalancerInput = z.infer<typeof GameBalancerInputSchema>;

export const BalanceChangeSuggestionSchema = z.object({
  targetType: z.enum(["globalRule", "itemStat", "enemyStat", "factionAbility", "questRewardValue", "resourceSpawnRate", "craftingRecipeCost"])
    .describe("The type of game element to change."),
  targetId: z.string().describe("ID of the specific rule (key in globalGameRules), item ID, enemy ID, faction ID, quest ID, resource ID, or recipe ID."),
  parameterToChange: z.string().describe("The specific parameter, stat, or sub-property to adjust (e.g., 'pvpDamageModifier', 'stats.ghz', 'stats.power', 'ability.cooldown', 'rewards.xp', 'spawnRate', 'ingredients.0.quantity'). Use dot notation for nested properties."),
  currentValue: z.any().optional().describe("The current value of the parameter for context."),
  suggestedChangeType: z.enum(["setValue", "percentageIncrease", "percentageDecrease", "absoluteIncrease", "absoluteDecrease", "replaceElement", "addElement", "removeElement"])
    .describe("How the change should be applied."),
  suggestedValue: z.any().describe("The new value (for setValue), or the amount/percentage of change (for increases/decreases), or the element to add/replace/remove."),
  reasoning: z.string().describe("Detailed explanation for why this change is proposed, directly linking it to specific metrics and the stated balance goals. Must be data-driven."),
  expectedImpact: z.string().describe("Anticipated impact of this change on gameplay metrics and player experience."),
  confidence: z.number().min(0).max(1).default(0.7).describe("Confidence in this specific suggestion (0-1)."),
  implementationNotes: z.string().optional().describe("Any notes for developers on how to implement this change or potential complexities."),
});

export const GameBalancerOutputSchema = z.object({
  overallAssessment: z.string().describe("A summary of the game's current balance state based on the input metrics and in relation to the balance goals."),
  suggestedChanges: z.array(BalanceChangeSuggestionSchema).describe("A list of specific, actionable balance change suggestions. Prioritize changes that directly address the balance goals. It's acceptable to suggest no changes if metrics are good."),
  priority: z.enum(["low", "medium", "high", "critical"]).optional().describe("Overall priority for implementing these changes based on severity of imbalance."),
  keyMetricsToMonitor: z.array(z.string()).optional().describe("Specific metrics to watch closely after these changes are implemented to verify their effect."),
  warnings: z.array(z.string()).optional().describe("Any potential negative side-effects, risks of over-correction, or areas requiring further investigation."),
});
export type GameBalancerOutput = z.infer<typeof GameBalancerOutputSchema>;

const gameBalancerPrompt = ai.definePrompt({
  name: 'gameBalancerPrompt',
  input: { schema: GameBalancerInputSchema },
  output: { schema: GameBalancerOutputSchema },
  prompt: `You are an expert Game Balancer AI for "Data Evolved", a complex game with dynamic AI factions and player-driven narratives.
Your objective is to analyze gameplay metrics, current game rules/stats, and player feedback to propose precise, data-driven changes that improve game balance, fairness, and long-term engagement, aligning with specific balance goals.

Gameplay Metrics:
{{{JSONstringify gameplayMetrics}}}

Current Global Game Rules:
{{{JSONstringify currentGlobalGameRules}}}

{{#if sampleItemStats.length}}
Sample Item Stats (for potential adjustment):
{{{JSONstringify sampleItemStats}}}
{{/if}}

{{#if sampleEnemyStats.length}}
Sample Enemy Stats (for potential adjustment):
{{{JSONstringify sampleEnemyStats}}}
{{/if}}

Specific Balancing Goals for this cycle:
{{#each balanceGoals}}- {{{this}}}
{{/each}}

{{#if historicalChanges.length}}
Recent Historical Balance Changes & Observed Impact:
{{#each historicalChanges}}- "{{changeDescription}}" ({{dateImplemented}}): {{observedImpact|default 'Impact not yet fully observed.'}}
{{/each}}
{{/if}}

Based on this comprehensive data:
1.  Provide an 'overallAssessment' of the current game balance, focusing on how it relates to the stated 'balanceGoals'.
2.  Generate a list of 'suggestedChanges'. Each suggestion MUST include:
    - 'targetType': e.g., "globalRule", "itemStat", "enemyStat".
    - 'targetId': The specific ID of the rule, item, or enemy.
    - 'parameterToChange': The exact parameter (use dot notation for nested, e.g., 'stats.power', 'rewards.xp').
    - 'currentValue' (optional): The current value of this parameter.
    - 'suggestedChangeType': How to apply the change (e.g., 'setValue', 'percentageIncrease').
    - 'suggestedValue': The new value or change amount.
    - 'reasoning': CRITICAL - Justify with specific metrics and how it addresses a balance goal.
    - 'expectedImpact': How will this change affect gameplay?
    - 'confidence': Your confidence in this suggestion (0-1).
    - 'implementationNotes' (optional): Notes for developers.
    Suggest changes conservatively. Address the balance goals. It's okay to suggest no changes if metrics are aligned with goals.
3.  Estimate the 'priority' for these changes (low, medium, high, critical).
4.  List 'keyMetricsToMonitor' after implementation.
5.  Include any 'warnings' about risks or over-correction.

Be precise and analytical. Your suggestions will directly influence the game's evolution.
`,
});

export const balanceGameFlow = ai.defineFlow(
  {
    name: 'balanceGameFlow',
    inputSchema: GameBalancerInputSchema,
    outputSchema: GameBalancerOutputSchema,
  },
  async (input) => {
    console.log("Game Balancer AI: Analyzing metrics for balance adjustments targeting goals:", input.balanceGoals.join(", "));
    const { output } = await gameBalancerPrompt(input);
    if (!output) {
        throw new Error("Game balancing AI failed to produce an output.");
    }
    console.log("Game Balancer AI: Suggestions generated:", output.suggestedChanges.length > 0 ? output.suggestedChanges : "No changes suggested.");
    return output;
  }
);

export async function balanceGame(input: GameBalancerInput): Promise<GameBalancerOutput> {
  return balanceGameFlow(input);
}

console.log("Genkit Flow for Game Balancer (apps/game-ai-genkit/src/flows/gameBalancer.ts) created.");
