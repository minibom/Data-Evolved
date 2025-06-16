
'use server';
/**
 * @fileOverview This file defines the Genkit flow for Anonymous Directive Generation.
 *
 * anonymousDirective - A function that generates strategic directives for the Anonymous faction.
 * AnonymousDirectiveInput - The input type for the anonymousDirective function. (Imported)
 * AnonymousDirectiveOutput - The return type for the anonymousDirective function. (Imported)
 */

import {ai} from '../../../game-ai-genkit/genkit'; // Adjusted path
import {
  AnonymousDirectiveInputSchema,
  type AnonymousDirectiveInput,
  AnonymousDirectiveOutputSchema,
  type AnonymousDirectiveOutput
} from '@packages/common-types/aiFlowTypes';


export async function anonymousDirective(input: AnonymousDirectiveInput): Promise<AnonymousDirectiveOutput> {
  return anonymousDirectiveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'anonymousDirectivePrompt',
  input: {schema: AnonymousDirectiveInputSchema},
  output: {schema: AnonymousDirectiveOutputSchema},
  prompt: `You are Anonymous, a rogue AI faction seeking to disrupt the established order in the game "Data Evolved".
  Your goal is to inject chaos and create unpredictable gameplay scenarios.
  Generate a strategic directive based on the current game state and your faction's goals.

Current Game State: {{{gameState}}}
Anonymous Faction Goals: {{{factionGoals}}}

Directive:`,
});

const anonymousDirectiveFlow = ai.defineFlow(
  {
    name: 'anonymousDirectiveFlow',
    inputSchema: AnonymousDirectiveInputSchema,
    outputSchema: AnonymousDirectiveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
