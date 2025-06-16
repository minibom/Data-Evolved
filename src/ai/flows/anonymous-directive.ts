'use server';
/**
 * @fileOverview This file defines the Genkit flow for Anonymous Directive Generation.
 *
 * anonymousDirective - A function that generates strategic directives for the Anonymous faction.
 * AnonymousDirectiveInput - The input type for the anonymousDirective function.
 * AnonymousDirectiveOutput - The return type for the anonymousDirective function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnonymousDirectiveInputSchema = z.object({
  gameState: z.string().describe('The current game state.'),
  factionGoals: z.string().describe('The current goals of the Anonymous faction.'),
});
export type AnonymousDirectiveInput = z.infer<typeof AnonymousDirectiveInputSchema>;

const AnonymousDirectiveOutputSchema = z.object({
  directive: z.string().describe('A strategic directive for the Anonymous faction.'),
});
export type AnonymousDirectiveOutput = z.infer<typeof AnonymousDirectiveOutputSchema>;

export async function anonymousDirective(input: AnonymousDirectiveInput): Promise<AnonymousDirectiveOutput> {
  return anonymousDirectiveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'anonymousDirectivePrompt',
  input: {schema: AnonymousDirectiveInputSchema},
  output: {schema: AnonymousDirectiveOutputSchema},
  prompt: `You are Anonymous, a rogue AI faction seeking to disrupt the established order in the game.
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
