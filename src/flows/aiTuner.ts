// src/flows/aiTuner.ts
'use server';
/**
 * @fileOverview Genkit flow for AI self-tuning based on game metrics.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { AIParameter } from '@packages/common-types/aiConfig'; // Assuming this type exists

export const AITuningInputSchema = z.object({
  gameMetrics: z.object({ // Simplified metrics for example
    averagePlayerEngagementScore: z.number().min(0).max(1).describe("Overall player engagement (0-1)."),
    factionBalanceRatio: z.number().describe("Ratio of AICore influence to Hacker influence (e.g., 1.0 is balanced, >1 AICore dominant)."),
    averageQuestCompletionRate: z.number().min(0).max(1).describe("Average quest completion rate."),
    economicStabilityIndex: z.number().min(0).max(1).describe("Stability of the in-game economy (0-1)."),
    recentPlayerFeedbackSummary: z.string().optional().describe("Summary of recent qualitative player feedback."),
  }).describe("Key performance indicators and metrics from the game."),
  currentAIParameters: z.array(
    z.object({ // Reflects AIParameter from common-types/aiConfig.ts
        key: z.string(),
        value: z.union([z.string(), z.number(), z.boolean()]),
        description: z.string(),
        category: z.string(), // Consider using the enum if directly mapping
        min: z.number().optional(),
        max: z.number().optional(),
        step: z.number().optional(),
    })
  ).describe("The current set of AI parameters being used."),
  tuningGoals: z.array(z.string()).describe("High-level goals for this tuning cycle (e.g., 'Increase player retention', 'Improve faction balance', 'Make AI Core less aggressive')."),
});
export type AITuningInput = z.infer<typeof AITuningInputSchema>;

export const AITuningOutputSchema = z.object({
  suggestedParameterChanges: z.array(
    z.object({
      key: z.string().describe("The AI parameter key to change."),
      newValue: z.union([z.string(), z.number(), z.boolean()]).describe("The suggested new value for the parameter."),
      reasoning: z.string().describe("Why this change is suggested based on metrics and goals."),
    })
  ).describe("Specific AI parameters to adjust and their new values."),
  confidenceScore: z.number().min(0).max(1).optional().describe("Overall confidence in these tuning suggestions."),
  notes: z.string().optional().describe("Any additional notes or observations from the AI tuner."),
});
export type AITuningOutput = z.infer<typeof AITuningOutputSchema>;


const aiTunerPrompt = ai.definePrompt({
  name: 'aiTunerPrompt',
  input: { schema: AITuningInputSchema },
  output: { schema: AITuningOutputSchema },
  prompt: `You are an AI System Tuner for the game "Data Evolved".
Your task is to analyze game metrics and current AI parameters to suggest adjustments that align with the specified tuning goals.

Current Game Metrics:
- Player Engagement: {{{gameMetrics.averagePlayerEngagementScore}}}
- Faction Balance (AICore/Hacker): {{{gameMetrics.factionBalanceRatio}}}
- Quest Completion Rate: {{{gameMetrics.averageQuestCompletionRate}}}
- Economic Stability: {{{gameMetrics.economicStabilityIndex}}}
{{#if gameMetrics.recentPlayerFeedbackSummary}}- Recent Player Feedback: {{{gameMetrics.recentPlayerFeedbackSummary}}}{{/if}}

Current AI Parameters:
{{#each currentAIParameters}}
- {{key}}: {{value}} ({{description}})
{{/each}}

Tuning Goals for this cycle:
{{#each tuningGoals}}
- {{{this}}}
{{/each}}

Based on this data, provide a list of suggested parameter changes. For each change, specify the parameter key, the new value, and a brief reasoning.
The changes should be conservative yet impactful. Prioritize changes that directly address the tuning goals.
Consider the potential interactions between parameters.
If no changes are strongly recommended, suggest an empty list or minor tweaks with low confidence.
`,
});

export const tuneAIParametersFlow = ai.defineFlow(
  {
    name: 'tuneAIParametersFlow',
    inputSchema: AITuningInputSchema,
    outputSchema: AITuningOutputSchema,
  },
  async (input) => {
    console.log("AI Tuner: Analyzing game metrics and AI parameters for tuning.");
    const { output } = await aiTunerPrompt(input);
    if (!output) {
        throw new Error("AI tuning process failed to produce an output.");
    }
    return output;
  }
);

export async function tuneAIParameters(input: AITuningInput): Promise<AITuningOutput> {
  return tuneAIParametersFlow(input);
}

console.log("Genkit Flow for AI Tuning (src/flows/aiTuner.ts) loaded.");
