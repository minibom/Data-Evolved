// apps/game-ai-genkit/src/flows/aiGovernance.ts
'use server';
/**
 * @fileOverview Genkit flow for AI governance, processing player feedback/votes on game evolution proposals.
 * This AI helps admins or an automated system assess the impact and feasibility of player-driven changes.
 */
import { ai } from '../../../game-ai-genkit/genkit'; // Adjusted path
import { z } from 'genkit';

export const AIGovernanceInputSchema = z.object({
  proposalId: z.string().describe("Unique ID of the proposal being reviewed."),
  proposalType: z.enum(["parameter_change", "new_event_idea", "faction_goal_suggestion", "lore_submission", "game_rule_modification", "new_feature_request"])
    .describe("The type of governance proposal submitted by players or game systems."),
  proposalContent: z.string().describe("The detailed content of the proposal (e.g., 'Change AI Core aggressiveness from 0.7 to 0.6', 'Introduce a 'Data Scarcity' world event affecting Zone Beta')."),
  proposerInfo: z.object({
    id: z.string().describe("ID of the player or system that submitted the proposal."),
    reputation: z.number().optional().describe("Reputation score of the proposer, if applicable."),
  }).optional().describe("Information about the proposer."),
  playerVotes: z.object({
    upvotes: z.number().int().min(0),
    downvotes: z.number().int().min(0),
    totalVotes: z.number().int().min(0),
    commentsSummary: z.string().optional().describe("AI-generated summary of top player comments on the proposal."),
  }).optional().describe("If applicable, the number of upvotes, downvotes, and a summary of player discussions."),
  relatedAIParameters: z.array(z.object({key: z.string(), value: z.any()})).optional().describe("Keys and current values of any current AI parameters relevant to this proposal."),
  contextualInformation: z.string().optional().describe("Any additional context from the game state relevant to evaluating the proposal (e.g., current faction balance, active world events, recent similar changes)."),
  currentGlobalGameRules: z.string().optional().describe("A snippet of current global game rules that might be affected."),
});
export type AIGovernanceInput = z.infer<typeof AIGovernanceInputSchema>;

export const AIGovernanceOutputSchema = z.object({
  assessmentSummary: z.string().describe("The AI's concise assessment of the proposal, considering its feasibility, impact on game balance, alignment with game vision, and player sentiment."),
  recommendation: z.enum(["approve", "reject", "defer_for_admin_review", "approve_with_modifications", "needs_more_community_feedback"])
    .describe("The AI's recommendation for the proposal."),
  suggestedModifications: z.string().optional().describe("If 'approve_with_modifications', details on suggested changes to make the proposal more viable or balanced."),
  potentialImpactAnalysis: z.object({
    positive: z.array(z.string()).optional().describe("List of potential positive impacts."),
    negative: z.array(z.string()).optional().describe("List of potential negative impacts or risks."),
    mitigationStrategies: z.array(z.string()).optional().describe("Suggestions to mitigate negative impacts."),
  }).describe("Analysis of potential positive and negative impacts."),
  reasoning: z.string().describe("Detailed reasoning behind the assessment and recommendation, referencing specific metrics or game aspects."),
  monitoringSuggestions: z.array(z.string()).optional().describe("What metrics or game aspects to monitor if the proposal is implemented."),
});
export type AIGovernanceOutput = z.infer<typeof AIGovernanceOutputSchema>;

const aiGovernancePrompt = ai.definePrompt({
  name: 'aiGovernancePrompt',
  input: { schema: AIGovernanceInputSchema },
  output: { schema: AIGovernanceOutputSchema },
  prompt: `You are an AI Governance Council member for the game "Data Evolved".
Your role is to review and assess proposals for game changes submitted by the player community or game systems. Your goal is to help maintain a healthy, engaging, and fair game world.

Proposal Review Task:
Proposal ID: {{{proposalId}}}
Proposal Type: {{{proposalType}}}

Proposal Content:
{{{proposalContent}}}

{{#if proposerInfo}}
Proposer ID: {{{proposerInfo.id}}} {{#if proposerInfo.reputation}}(Reputation: {{{proposerInfo.reputation}}}){{/if}}
{{/if}}

{{#if playerVotes}}
Player Votes: Upvotes: {{{playerVotes.upvotes}}}, Downvotes: {{{playerVotes.downvotes}}}, Total: {{{playerVotes.totalVotes}}}
{{#if playerVotes.commentsSummary}}Player Comments Summary: {{{playerVotes.commentsSummary}}}{{/if}}
{{/if}}

{{#if relatedAIParameters.length}}
Relevant Current AI Parameters:
{{#each relatedAIParameters}}- {{key}}: {{value}}{{/each}}
{{/if}}

{{#if contextualInformation}}
Contextual Game Information: {{{contextualInformation}}}
{{/if}}

{{#if currentGlobalGameRules}}
Relevant Current Global Game Rules Snippet: {{{currentGlobalGameRules}}}
{{/if}}

Please provide a thorough assessment:
1.  'assessmentSummary': Briefly summarize your findings.
2.  'recommendation': Choose from 'approve', 'reject', 'defer_for_admin_review', 'approve_with_modifications', 'needs_more_community_feedback'.
3.  'suggestedModifications': If recommending modifications, detail them.
4.  'potentialImpactAnalysis': List potential 'positive' and 'negative' impacts, and 'mitigationStrategies'.
5.  'reasoning': Provide detailed justification for your recommendation, referencing the proposal's alignment with game vision (dynamic, AI-driven, faction conflict), technical feasibility, balance implications, and community sentiment.
6.  'monitoringSuggestions': What should be watched if this is implemented?

Consider these aspects:
- Feasibility: Can this be implemented technically and within existing game systems?
- Balance: How might this affect game balance, faction dynamics, player experience, and the economy?
- Alignment: Does this align with "Data Evolved"'s core themes of AI conflict, data evolution, and player agency?
- Player Sentiment: (If votes are provided) How does the community feel? Is there strong consensus or division?
- Exploitability: Could this change be easily exploited?
`,
});

export const processGovernanceProposalFlow = ai.defineFlow(
  {
    name: 'processGovernanceProposalFlow',
    inputSchema: AIGovernanceInputSchema,
    outputSchema: AIGovernanceOutputSchema,
  },
  async (input) => {
    console.log("AI Governance: Processing proposal ID:", input.proposalId, "Type:", input.proposalType);
    const { output } = await aiGovernancePrompt(input);
     if (!output) {
        throw new Error("AI governance process failed to produce an output for proposal " + input.proposalId);
    }
    return output;
  }
);

export async function processGovernanceProposal(input: AIGovernanceInput): Promise<AIGovernanceOutput> {
  return processGovernanceProposalFlow(input);
}

console.log("Genkit Flow for AI Governance (apps/game-ai-genkit/src/flows/aiGovernance.ts) loaded.");
