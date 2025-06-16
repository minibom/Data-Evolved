// apps/game-ai-genkit/src/flows/aiTuner.ts
'use server';
/**
 * @fileOverview Genkit flow for AI self-tuning based on game metrics.
 * This AI analyzes game performance data and player feedback to suggest adjustments
 * to global AI parameters, aiming to improve balance, engagement, and overall game health.
 */
import { ai } from '../../../game-ai-genkit/genkit'; // Adjusted path
import { z } from 'genkit';
import type { AIParameter } from '@packages/common-types/aiConfig'; // Assuming this type exists for AI parameters

export const AITuningInputSchema = z.object({
  gameMetrics: z.object({ 
    averagePlayerSessionMinutes: z.number().optional().describe("Average player session length in minutes over the last period."),
    dailyActiveUsers: z.number().int().optional().describe("Number of unique players active per day."),
    playerRetentionRate7Day: z.number().min(0).max(1).optional().describe("Percentage of players returning after 7 days."),
    factionBalanceRatio: z.record(z.number()).optional().describe("Key-value pair of faction engagement or success ratios (e.g., {'AICore_vs_Hacker_ZoneControl': 1.2} means AICore controls 20% more relevant zones)."),
    itemUsageStats: z.record(z.number()).optional().describe("Usage rates for key items or item categories (e.g., {'common_health_stim': 0.8, 'rare_ghz_booster': 0.1})."),
    questCompletionTimes: z.record(z.number()).optional().describe("Average time in minutes to complete specific important quests (questId: minutes)."),
    economicHealth: z.object({
      inflationRate: z.number().optional().describe("Inflation/deflation rate of primary currency."),
      resourceScarcity: z.record(z.string()).optional().describe("Key-value of resourceId and its scarcity level (e.g., {'data_scrap_common': 'abundant', 'energy_crystal_rare': 'scarce'})."),
    }).optional().describe("Indicators of in-game economic health."),
    playerFeedbackSummary: z.string().optional().describe("AI-summarized qualitative player feedback regarding game balance, difficulty, or specific AI behaviors."),
    aiDirectiveEffectiveness: z.record(z.string()).optional().describe("Metrics on how effective recent AI Core/Anonymous directives were (e.g., {'directive_XYZ_zone_capture': 'successful', 'directive_ABC_player_engagement': 'low_impact'})."),
  }).describe("Key performance indicators and metrics from the game."),
  currentAIParameters: z.array(AIParameterSchema).describe("The current set of global AI parameters being used (from DynamicAIConfig)."),
  tuningGoals: z.array(z.string()).min(1).describe("High-level goals for this tuning cycle (e.g., 'Increase player retention for mid-level players', 'Improve faction balance in Contested Zones', 'Make Anonymous AI feel more impactful but less frustrating', 'Boost usage of underutilized crafting recipes')."),
  lastTuningCycleChanges: z.array(z.string()).optional().describe("Summary of changes made in the previous tuning cycle, to assess their impact."),
});
export type AITuningInput = z.infer<typeof AITuningInputSchema>;

export const AITuningOutputSchema = z.object({
  analysisSummary: z.string().describe("A brief summary of the AI's analysis of current metrics against tuning goals."),
  suggestedParameterChanges: z.array(
    z.object({
      parameterKey: z.string().describe("The AI parameter key to change (must exist in currentAIParameters)."),
      currentValue: z.union([z.string(), z.number(), z.boolean()]).describe("The current value of the parameter for reference."),
      suggestedNewValue: z.union([z.string(), z.number(), z.boolean()]).describe("The suggested new value for the parameter. Must respect min/max/step if defined for the parameter."),
      reasoning: z.string().describe("Detailed reasoning for why this change is suggested, linking it to specific metrics and tuning goals."),
      expectedImpact: z.string().describe("What positive impact this change is expected to have on the game and metrics."),
      confidence: z.number().min(0).max(1).describe("Confidence level (0-1) in this specific suggestion."),
    })
  ).describe("Specific AI parameters to adjust and their new values. Suggest only necessary and impactful changes."),
  overallConfidenceScore: z.number().min(0).max(1).optional().describe("Overall confidence in this set of tuning suggestions."),
  warningsOrRisks: z.array(z.string()).optional().describe("Any potential negative side-effects or risks associated with the suggested changes."),
  metricsToMonitorPostChange: z.array(z.string()).optional().describe("Specific metrics to closely monitor after implementing these changes."),
});
export type AITuningOutput = z.infer<typeof AITuningOutputSchema>;


const aiTunerPrompt = ai.definePrompt({
  name: 'aiTunerPrompt',
  input: { schema: AITuningInputSchema },
  output: { schema: AITuningOutputSchema },
  prompt: `You are an AI System Tuner for the game "Data Evolved".
Your task is to analyze comprehensive game metrics and current AI parameters to suggest adjustments that align with specified tuning goals. The aim is to maintain a healthy, engaging, and balanced game ecosystem.

Current Game Metrics:
{{{JSONstringify gameMetrics}}}

Current AI Parameters:
{{#each currentAIParameters}}
- Key: {{key}}, Current Value: {{value}}, Category: {{category}}{{#if min}}, Min: {{min}}{{/if}}{{#if max}}, Max: {{max}}{{/if}}{{#if step}}, Step: {{step}}{{/if}} (Desc: {{description}})
{{/each}}

Tuning Goals for this cycle:
{{#each tuningGoals}}
- {{{this}}}
{{/each}}

{{#if lastTuningCycleChanges.length}}
Changes from Last Tuning Cycle:
{{#each lastTuningCycleChanges}}- {{{this}}}{{/each}}
{{/if}}

Based on this data:
1.  Provide an 'analysisSummary' of how current metrics align or misalign with the tuning goals.
2.  Generate a list of 'suggestedParameterChanges'. For each change:
    - Identify the 'parameterKey' from the currentAIParameters.
    - State its 'currentValue'.
    - Propose a 'suggestedNewValue'. This new value MUST be valid for the parameter type and respect its min/max/step constraints if defined.
    - Provide clear 'reasoning' linking the change to metrics and goals.
    - Describe the 'expectedImpact'.
    - Assign a 'confidence' score (0-1).
    Only suggest changes if they are well-justified by the data and goals. It's okay to suggest no changes if the system is performing well against the goals.
3.  Optionally, provide an 'overallConfidenceScore' for the entire set of suggestions.
4.  List any 'warningsOrRisks' associated with the changes.
5.  Suggest 'metricsToMonitorPostChange' to evaluate the effectiveness of the tuning.

Focus on data-driven, impactful, and conservative adjustments. Explain the "why" behind each suggestion clearly.
If a parameter is already at an optimal value for a goal, state that no change is needed for that parameter regarding that goal.
`,
});

export const tuneAIParametersFlow = ai.defineFlow(
  {
    name: 'tuneAIParametersFlow',
    inputSchema: AITuningInputSchema,
    outputSchema: AITuningOutputSchema,
  },
  async (input) => {
    console.log("AI Tuner: Analyzing game metrics and AI parameters for tuning cycle.");
    const { output } = await aiTunerPrompt(input);
    if (!output) {
        throw new Error("AI tuning process failed to produce an output.");
    }
    // Post-process: Ensure suggestedNewValue is valid for the parameter type and constraints
    if (output.suggestedParameterChanges) {
        output.suggestedParameterChanges.forEach(change => {
            const paramDef = input.currentAIParameters.find(p => p.key === change.parameterKey);
            if (paramDef) {
                if (typeof paramDef.value === 'number') {
                    change.suggestedNewValue = Number(change.suggestedNewValue);
                    if (paramDef.min !== undefined) change.suggestedNewValue = Math.max(paramDef.min, change.suggestedNewValue as number);
                    if (paramDef.max !== undefined) change.suggestedNewValue = Math.min(paramDef.max, change.suggestedNewValue as number);
                } else if (typeof paramDef.value === 'boolean') {
                    change.suggestedNewValue = String(change.suggestedNewValue).toLowerCase() === 'true';
                }
                 // For string with options, ensure value is one of options (LLM should handle this from prompt)
            }
        });
    }
    return output;
  }
);

export async function tuneAIParameters(input: AITuningInput): Promise<AITuningOutput> {
  return tuneAIParametersFlow(input);
}

console.log("Genkit Flow for AI Tuning (apps/game-ai-genkit/src/flows/aiTuner.ts) loaded.");
