// src/flows/narrativeWeaver.ts
'use server';
/**
 * @fileOverview Genkit flow for AI narrative generation based on player actions and world events.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const NarrativeWeaverInputSchema = z.object({
  recentMajorPlayerActions: z.array(z.object({
    playerId: z.string(),
    actionDescription: z.string().describe("e.g., 'Player X defeated Boss Y', 'Faction Z captured Zone A'"),
    timestamp: z.string().datetime(),
  })).describe("Log of significant player actions in the last cycle (e.g., 24 hours)."),
  recentWorldEvents: z.array(z.object({
    eventId: z.string(),
    eventName: z.string(),
    eventSummary: z.string().describe("Brief summary of the event's impact."),
    timestamp: z.string().datetime(),
  })).describe("Log of significant world events in the last cycle."),
  currentFactionStandings: z.record(z.number()).optional().describe("Key-value pair of factionId and their current influence/power score."),
  outputType: z.enum(["lore_fragment", "news_bulletin", "historical_record", "prophecy_snippet"])
    .default("lore_fragment").describe("The desired type of narrative output."),
  desiredLength: z.enum(["short", "medium", "long"]).default("medium").describe("Desired length of the narrative piece."),
});
export type NarrativeWeaverInput = z.infer<typeof NarrativeWeaverInputSchema>;

export const NarrativeWeaverOutputSchema = z.object({
  title: z.string().optional().describe("A title for the generated narrative piece."),
  narrativeText: z.string().describe("The generated narrative content."),
  sourceAttribution: z.string().optional().describe("Suggested in-game source (e.g., 'Recovered AI Core Log', 'Anonymous Data Cache', 'Nexus Historian Archives')."),
  relatedEntities: z.array(z.string()).optional().describe("IDs of players, factions, or zones prominently featured."),
});
export type NarrativeWeaverOutput = z.infer<typeof NarrativeWeaverOutputSchema>;


const narrativeWeaverPrompt = ai.definePrompt({
  name: 'narrativeWeaverPrompt',
  input: { schema: NarrativeWeaverInputSchema },
  output: { schema: NarrativeWeaverOutputSchema },
  prompt: `You are a Narrative Weaver AI for "Data Evolved", tasked with creating engaging lore and stories.
Your goal is to synthesize recent game events and player actions into a cohesive narrative piece of type '{{{outputType}}}' and length '{{{desiredLength}}}'.

Recent Major Player Actions:
{{#if recentMajorPlayerActions.length}}
{{#each recentMajorPlayerActions}}
- At {{timestamp}}: {{{actionDescription}}} (Player: {{playerId}})
{{/each}}
{{else}}
- No major player actions reported in this cycle.
{{/if}}

Recent World Events:
{{#if recentWorldEvents.length}}
{{#each recentWorldEvents}}
- Event '{{eventName}}' (ID: {{eventId}}) occurred at {{timestamp}}: {{{eventSummary}}}
{{/each}}
{{else}}
- No major world events reported in this cycle.
{{/if}}

{{#if currentFactionStandings}}
Current Faction Standings (Influence):
{{#each currentFactionStandings}}
- {{@key}}: {{{this}}}
{{/each}}
{{/if}}

Weave these elements into a narrative. It could be a historical record, a piece of emergent lore, a news bulletin for players, or even a cryptic prophecy.
The tone should match the game's themes of digital existence, AI conflict, and evolving data.
Suggest a suitable title and an in-game source attribution for this piece.
If specific entities are central, list their IDs.
Focus on making the world feel alive and responsive to player actions.
`,
});


export const weaveNarrativeFlow = ai.defineFlow(
  {
    name: 'weaveNarrativeFlow',
    inputSchema: NarrativeWeaverInputSchema,
    outputSchema: NarrativeWeaverOutputSchema,
  },
  async (input) => {
    console.log("Narrative Weaver: Crafting story from recent events.");
    const { output } = await narrativeWeaverPrompt(input);
     if (!output) {
        throw new Error("Narrative weaving process failed to produce an output.");
    }
    return output;
  }
);

export async function weaveNarrative(input: NarrativeWeaverInput): Promise<NarrativeWeaverOutput> {
  return weaveNarrativeFlow(input);
}

console.log("Genkit Flow for Narrative Weaver (src/flows/narrativeWeaver.ts) loaded.");
