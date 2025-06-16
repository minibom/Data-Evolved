'use server';

/**
 * @fileOverview A Genkit flow for the AI Core to generate strategic directives.
 *
 * - aiCoreDirective - A function that generates strategic directives for the AI Core.
 * - AICoreDirectiveInput - The input type for the aiCoreDirective function. (Imported)
 * - AICoreDirectiveOutput - The return type for the aiCoreDirective function. (Imported)
 */

import {ai} from '@/ai/genkit';
import {
  AICoreDirectiveInputSchema,
  type AICoreDirectiveInput,
  AICoreDirectiveOutputSchema,
  type AICoreDirectiveOutput
} from '@packages/common-types/aiFlowTypes';

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
