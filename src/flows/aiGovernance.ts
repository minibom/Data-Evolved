// src/flows/aiGovernance.ts
'use server';
/**
 * @fileOverview Genkit flow for AI governance, processing player feedback/votes.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const AIGovernanceInputSchema = z.object({
  proposalType: z.enum(["parameter_change", "new_event_idea", "faction_goal_suggestion", "lore_submission"])
    .describe("The type of governance proposal submitted by players."),
  proposalContent: z.string().describe("The detailed content of the player's proposal."),
  playerVotes: z.object({
    upvotes: z.number().int().min(0),
    downvotes: z.number().int().min(0),
  }).optional().describe("If applicable, the number of upvotes and downvotes the proposal has received."),
  relatedAIParameters: z.array(z.string()).optional().describe("Keys of any current AI parameters relevant to this proposal."),
  contextualInformation: z.string().optional().describe("Any additional context from the game state relevant to evaluating the proposal (e.g., current faction balance, active world events)."),
});
export type AIGovernanceInput = z.infer<typeof AIGovernanceInputSchema>;

export const AIGovernanceOutputSchema = z.object({
  assessment: z.string().describe("The AI's assessment of the proposal, considering its feasibility, impact on game balance, and alignment with game vision."),
  recommendation: z.enum(["approve", "reject", "defer_for_review", "approve_with_modifications"])
    .describe("The AI's recommendation for the proposal."),
  suggestedModifications: z.string().optional().describe("If 'approve_with_modifications', details on suggested changes."),
  potentialImpactScore: z.number().min(0).max(10).optional().describe("A score (0-10) indicating the potential positive or negative impact of implementing the proposal."),
  reasoning: z.string().describe("Detailed reasoning behind the assessment and recommendation."),
});
export type AIGovernanceOutput = z.infer<typeof AIGovernanceOutputSchema>;

const aiGovernancePrompt = ai.definePrompt({
  name: 'aiGovernancePrompt',
  input: { schema: AIGovernanceInputSchema },
  output: { schema: AIGovernanceOutputSchema },
  prompt: `You are an AI Governance Council member for "Data Evolved".
Your role is to review and assess proposals submitted by the player community or game administrators.

Proposal Type: {{{proposalType}}}
Proposal Content:
{{{proposalContent}}}

{{#if playerVotes}}
Player Votes: Upvotes: {{{playerVotes.upvotes}}}, Downvotes: {{{playerVotes.downvotes}}}
{{/if}}

{{#if relatedAIParameters.length}}
Relevant Current AI Parameters: {{#each relatedAIParameters}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

{{#if contextualInformation}}
Contextual Game Information: {{{contextualInformation}}}
{{/if}}

Please provide a thorough assessment of this proposal. Consider:
1.  Feasibility: Can this be implemented technically and within game systems?
2.  Balance: How might this affect game balance, faction dynamics, and player experience?
3.  Alignment: Does this align with the core vision and themes of "Data Evolved"?
4.  Player Sentiment: (If votes are provided) How does the community feel about this?

Based on your assessment, provide a clear recommendation (approve, reject, defer_for_review, approve_with_modifications), any suggested modifications if applicable, an estimated potential impact score (0-10, where 5 is neutral, >5 positive, <5 negative), and detailed reasoning.
Your goal is to help maintain a healthy, engaging, and fair game world.
`,
});

export const processGovernanceProposalFlow = ai.defineFlow(
  {
    name: 'processGovernanceProposalFlow',
    inputSchema: AIGovernanceInputSchema,
    outputSchema: AIGovernanceOutputSchema,
  },
  async (input) => {
    console.log("AI Governance: Processing proposal of type:", input.proposalType);
    const { output } = await aiGovernancePrompt(input);
     if (!output) {
        throw new Error("AI governance process failed to produce an output.");
    }
    return output;
  }
);

export async function processGovernanceProposal(input: AIGovernanceInput): Promise<AIGovernanceOutput> {
  return processGovernanceProposalFlow(input);
}

console.log("Genkit Flow for AI Governance (src/flows/aiGovernance.ts) loaded.");
