// src/flows/gameBalancer.ts
'use server';
/**
 * @fileOverview Genkit flow for AI Game Balancing.
 * This AI analyzes game metrics and player feedback to suggest or
 * automatically apply balancing changes to game rules, item stats,
 * or enemy parameters.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
// Assuming GlobalGameRules and other relevant types are defined in @packages/common-types
// For now, using placeholders.
// import type { GlobalGameRules } from '@packages/common-types/db';
// import type { ItemStats, EnemyStats } from '@packages/common-types/game';

// Placeholder for actual types
type GlobalGameRules = Record<string, any>;
type ItemStats = Record<string, any>;
type EnemyStats = Record<string, any>;

export const GameBalancerInputSchema = z.object({
  gameplayMetrics: z.object({
    averageSessionLength: z.number().optional().describe("Average player session length in minutes."),
    playerRetentionRate: z.number().min(0).max(1).optional().describe("Player retention rate over a period (e.g., 7-day)."),
    factionWinLossRatio: z.record(z.number()).optional().describe("Win/loss ratio for each faction in PvP or zone control."),
    mostUsedItems: z.array(z.string()).optional().describe("List of IDs of the most frequently used items."),
    leastUsedItems: z.array(z.string()).optional().describe("List of IDs of the least frequently used items."),
    playerFeedbackSummary: z.string().optional().describe("AI-summarized qualitative player feedback regarding balance."),
    averageQuestCompletionTime: z.record(z.number()).optional().describe("Average time to complete key quests (questId: minutes)."),
    economicInflationRate: z.number().optional().describe("Rate of economic inflation or deflation."),
  }).describe("Aggregated gameplay metrics and player feedback."),
  currentGlobalGameRules: z.custom<GlobalGameRules>().describe("The current set of global game rules."),
  currentItemStats: z.array(z.custom<ItemStats>()).optional().describe("Current stats for a selection of key items."),
  currentEnemyStats: z.array(z.custom<EnemyStats>()).optional().describe("Current stats for a selection of key enemy types."),
  balanceGoals: z.array(z.string()).optional().describe("Specific balancing goals for this cycle (e.g., 'Improve viability of underused Hacker skills', 'Reduce AI Core dominance in Zone Alpha', 'Make early game combat less punishing')."),
});
export type GameBalancerInput = z.infer<typeof GameBalancerInputSchema>;

export const BalanceChangeSuggestionSchema = z.object({
  targetType: z.enum(["globalRule", "itemStat", "enemyStat", "factionBuff", "questReward"])
    .describe("The type of game element to change."),
  targetId: z.string().describe("ID of the specific rule, item, enemy, etc."),
  parameterToChange: z.string().describe("The specific parameter or stat to adjust (e.g., 'baseDamageMultiplier', 'item.ghzBonus', 'enemy.power')."),
  suggestedChange: z.union([z.string(), z.number(), z.boolean()]).describe("The suggested new value or change formula (e.g., '+10%', '-5', 'set_true')."),
  reasoning: z.string().describe("Explanation for why this change is proposed based on metrics and goals."),
  expectedImpact: z.string().optional().describe("Anticipated impact of this change on gameplay."),
  confidence: z.number().min(0).max(1).optional().describe("Confidence in this specific suggestion (0-1)."),
});

export const GameBalancerOutputSchema = z.object({
  overallAssessment: z.string().describe("A summary of the game's current balance state based on the input metrics."),
  suggestedChanges: z.array(BalanceChangeSuggestionSchema).describe("A list of specific, actionable balance change suggestions."),
  priority: z.enum(["low", "medium", "high"]).optional().describe("Overall priority for implementing these changes."),
  notes: z.string().optional().describe("Any additional observations or warnings."),
});
export type GameBalancerOutput = z.infer<typeof GameBalancerOutputSchema>;

const gameBalancerPrompt = ai.definePrompt({
  name: 'gameBalancerPrompt',
  input: { schema: GameBalancerInputSchema },
  output: { schema: GameBalancerOutputSchema },
  prompt: `You are an expert Game Balancer AI for "Data Evolved".
Your objective is to analyze gameplay metrics, current game rules, and player feedback to propose changes that improve game balance, fairness, and engagement.

Gameplay Metrics:
{{#if gameplayMetrics.averageSessionLength}}- Avg Session Length: {{{gameplayMetrics.averageSessionLength}}} min{{/if}}
{{#if gameplayMetrics.playerRetentionRate}}- Player Retention: {{{gameplayMetrics.playerRetentionRate}}}{{/if}}
{{#if gameplayMetrics.factionWinLossRatio}}Faction Win/Loss Ratios:
{{#each gameplayMetrics.factionWinLossRatio}}  - {{@key}}: {{{this}}}
{{/each}}{{/if}}
{{#if gameplayMetrics.mostUsedItems.length}}- Most Used Items: {{#each gameplayMetrics.mostUsedItems}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if gameplayMetrics.leastUsedItems.length}}- Least Used Items: {{#each gameplayMetrics.leastUsedItems}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if gameplayMetrics.playerFeedbackSummary}}- Player Feedback Summary: {{{gameplayMetrics.playerFeedbackSummary}}}{{/if}}
{{#if gameplayMetrics.economicInflationRate}}- Economic Inflation: {{{gameplayMetrics.economicInflationRate}}}{{/if}}

Current Global Game Rules (Snapshot):
{{{JSONstringify currentGlobalGameRules}}}

{{#if currentItemStats.length}}
Current Item Stats (Sample):
{{{JSONstringify currentItemStats}}}
{{/if}}

{{#if currentEnemyStats.length}}
Current Enemy Stats (Sample):
{{{JSONstringify currentEnemyStats}}}
{{/if}}

{{#if balanceGoals.length}}
Specific Balancing Goals for this cycle:
{{#each balanceGoals}}- {{{this}}}
{{/each}}
{{/if}}

Based on this data:
1.  Provide an 'overallAssessment' of the current game balance.
2.  Generate a list of 'suggestedChanges'. Each change should target a specific element ('globalRule', 'itemStat', 'enemyStat', etc.), specify the 'targetId', the 'parameterToChange', the 'suggestedChange' (value or formula), and 'reasoning'.
3.  Estimate the 'priority' for these changes.
4.  Add any important 'notes'.

Changes should be conservative and aimed at achieving the specified balance goals or addressing clear imbalances indicated by the metrics. Avoid drastic overhauls unless metrics are critical.
Consider potential ripple effects of each change.
`,
});

export const balanceGameFlow = ai.defineFlow(
  {
    name: 'balanceGameFlow',
    inputSchema: GameBalancerInputSchema,
    outputSchema: GameBalancerOutputSchema,
  },
  async (input) => {
    console.log("Game Balancer AI: Analyzing metrics for balance adjustments...");
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

console.log("Genkit Flow for Game Balancer (src/flows/gameBalancer.ts) created.");
