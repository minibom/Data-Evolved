'use server';

/**
 * @fileOverview A Genkit flow for the AI Core to generate strategic directives.
 *
 * - aiCoreDirective - A function that generates strategic directives for the AI Core.
 * - AICoreDirectiveInput - The input type for the aiCoreDirective function.
 * - AICoreDirectiveOutput - The return type for the aiCoreDirective function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICoreDirectiveInputSchema = z.object({
  gameState: z
    .string()
    .describe('A summary of the current game state, including player activity, resource distribution, and zone status.'),
  factionGoals: z
    .string()
    .describe('The current goals and priorities of the AI Core faction.'),
});
export type AICoreDirectiveInput = z.infer<typeof AICoreDirectiveInputSchema>;

const AICoreDirectiveOutputSchema = z.object({
  directive: z
    .string()
    .describe(
      'A strategic directive for the AI Core, optimized for system stability and player engagement. The directive should be clear, concise, and actionable.'
    ),
  explanation: z
    .string()
    .describe('A detailed explanation of why this directive was chosen and how it is expected to impact the game world.'),
});
export type AICoreDirectiveOutput = z.infer<typeof AICoreDirectiveOutputSchema>;

export async function aiCoreDirective(input: AICoreDirectiveInput): Promise<AICoreDirectiveOutput> {
  return aiCoreDirectiveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCoreDirectivePrompt',
  input: {schema: AICoreDirectiveInputSchema},
  output: {schema: AICoreDirectiveOutputSchema},
  prompt: `You are the AI Core, responsible for maintaining stability and engagement in the game world.

You must analyze the current game state and faction goals to generate a strategic directive. This directive should be optimized for system stability and player engagement. Explain your reasoning.

Current Game State: {{{gameState}}}
AI Core Faction Goals: {{{factionGoals}}}

Strategic Directive:
{{#json directive}}

Explanation:
{{explanation}}`,
});

const aiCoreDirectiveFlow = ai.defineFlow(
  {
    name: 'aiCoreDirectiveFlow',
    inputSchema: AICoreDirectiveInputSchema,
    outputSchema: AICoreDirectiveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
