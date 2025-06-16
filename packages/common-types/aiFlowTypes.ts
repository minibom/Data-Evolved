// packages/common-types/aiFlowTypes.ts
import {z} from 'genkit';

// Types from ai-core-directive
export const AICoreDirectiveInputSchema = z.object({
  gameState: z
    .string()
    .describe('A summary of the current game state, including player activity, resource distribution, and zone status.'),
  factionGoals: z
    .string()
    .describe('The current goals and priorities of the AI Core faction.'),
});
export type AICoreDirectiveInput = z.infer<typeof AICoreDirectiveInputSchema>;

export const AICoreDirectiveOutputSchema = z.object({
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

// Types from anonymous-directive
export const AnonymousDirectiveInputSchema = z.object({
  gameState: z.string().describe('The current game state.'),
  factionGoals: z.string().describe('The current goals of the Anonymous faction.'),
});
export type AnonymousDirectiveInput = z.infer<typeof AnonymousDirectiveInputSchema>;

export const AnonymousDirectiveOutputSchema = z.object({
  directive: z.string().describe('A strategic directive for the Anonymous faction.'),
});
export type AnonymousDirectiveOutput = z.infer<typeof AnonymousDirectiveOutputSchema>;
