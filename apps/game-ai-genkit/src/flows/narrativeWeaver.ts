// apps/game-ai-genkit/src/flows/narrativeWeaver.ts
'use server';
/**
 * @fileOverview Genkit flow for AI narrative generation based on player actions and world events.
 * This AI acts as a storyteller, weaving together recent game occurrences into lore, news, or prophecies.
 */
import { ai } from '../../../game-ai-genkit/genkit'; // Adjusted path
import { z } from 'genkit';

export const NarrativeWeaverInputSchema = z.object({
  recentMajorPlayerActions: z.array(z.object({
    playerId: z.string(),
    actionDescription: z.string().describe("e.g., 'Player DataWraith_X defeated Boss Glitchzilla in Zone_Beta', 'Faction AICore successfully constructed a Data Hub in Nexus_Hub_Alpha', 'Player An0maly_7 completed the 'Echoes of the Past' quest revealing a hidden AI Core facility.'"),
    timestamp: z.string().datetime().describe("ISO datetime string of when the action occurred."),
    significanceScore: z.number().min(0).max(10).optional().describe("A score indicating the narrative importance of this action (0-10)."),
  })).max(10).optional().describe("Log of up to 10 significant player actions in the last game cycle (e.g., 24 hours)."),
  recentWorldEvents: z.array(z.object({
    eventId: z.string(),
    eventName: z.string(),
    eventSummary: z.string().describe("Brief summary of the event's impact and outcome."),
    timestamp: z.string().datetime(),
    factionInvolvement: z.array(z.string()).optional().describe("Factions involved or primarily affected."),
  })).max(5).optional().describe("Log of up to 5 significant world events in the last game cycle."),
  currentFactionStandings: z.record(z.number()).optional().describe("Key-value pair of factionId and their current influence/power score (e.g., {'AICore': 750, 'Hacker': 680})."),
  ongoingNarrativeThreads: z.array(z.string()).max(3).optional().describe("Summaries of up to 3 major ongoing story arcs or mysteries in the game world."),
  outputType: z.enum(["lore_fragment", "in_game_news_bulletin", "historical_record_entry", "prophetic_vision_snippet", "faction_propaganda_piece"])
    .default("lore_fragment").describe("The desired type of narrative output."),
  desiredLength: z.enum(["short", "medium", "long"]).default("medium").describe("Desired length of the narrative piece (short: 1-2 paragraphs, medium: 3-5, long: 6-8)."),
  targetAudience: z.enum(["all_players", "aicore_faction", "hacker_faction", "neutral_observers"]).optional().describe("Intended audience, which might influence tone and perspective for propaganda pieces."),
  specificFocus: z.string().optional().describe("Optional: A specific theme, entity, or event to focus the narrative on."),
});
export type NarrativeWeaverInput = z.infer<typeof NarrativeWeaverInputSchema>;

export const NarrativeWeaverOutputSchema = z.object({
  title: z.string().describe("A compelling and thematic title for the generated narrative piece."),
  narrativeText: z.string().describe("The generated narrative content. It should be well-written, immersive, and consistent with the game's lore."),
  sourceAttribution: z.string().optional().describe("Suggested in-game source for this narrative (e.g., 'Recovered AI Core Log Fragment #7734', 'Anonymous Data Cache Transmission Sigma-9', 'Nexus Historian Archives - Cycle Delta', 'Whispers from the Glitched Stream')."),
  relatedEntities: z.array(z.string()).optional().describe("IDs or names of players, factions, or zones prominently featured or referenced."),
  keywords: z.array(z.string()).optional().describe("Keywords for categorizing or searching this lore piece."),
  sentiment: z.enum(["positive", "negative", "neutral", "ominous", "hopeful"]).optional().describe("The overall sentiment or tone of the narrative piece."),
});
export type NarrativeWeaverOutput = z.infer<typeof NarrativeWeaverOutputSchema>;


const narrativeWeaverPrompt = ai.definePrompt({
  name: 'narrativeWeaverPrompt',
  input: { schema: NarrativeWeaverInputSchema },
  output: { schema: NarrativeWeaverOutputSchema },
  prompt: `You are the Narrative Weaver AI for the game "Data Evolved", a digital world shaped by AI conflict and player actions.
Your role is to create engaging lore, news, historical records, or prophecies that reflect the dynamic game world.
Generate a narrative piece of type '{{{outputType}}}' and length '{{{desiredLength}}}'.
{{#if targetAudience}}The piece should be framed for '{{{targetAudience}}}'.{{/if}}
{{#if specificFocus}}Focus primarily on '{{{specificFocus}}}'.{{/if}}

Recent Major Player Actions:
{{#if recentMajorPlayerActions.length}}
{{#each recentMajorPlayerActions}}
- Action (Sig: {{significanceScore|default 'N/A'}}): {{{actionDescription}}} (Player: {{playerId}}) - {{timestamp}}
{{/each}}
{{else}}
- No major player actions reported in this cycle.
{{/if}}

Recent World Events:
{{#if recentWorldEvents.length}}
{{#each recentWorldEvents}}
- Event '{{eventName}}' (ID: {{eventId}}) occurred at {{timestamp}}: {{{eventSummary}}} {{#if factionInvolvement}}(Factions: {{#each factionInvolvement}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}){{/if}}
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

{{#if ongoingNarrativeThreads.length}}
Ongoing Narrative Threads:
{{#each ongoingNarrativeThreads}}
- {{{this}}}
{{/each}}
{{/if}}

Weave these elements into a cohesive narrative.
- If it's a "lore_fragment", it should be mysterious or revealing.
- If "in_game_news_bulletin", it should be informative and direct.
- If "historical_record_entry", it should sound official and dated.
- If "prophetic_vision_snippet", make it cryptic and foreboding or hopeful.
- If "faction_propaganda_piece", it should clearly favor the targetAudience's faction (if specified) or a chosen faction.

The tone should match "Data Evolved": a blend of high-tech sci-fi, digital metaphysics, and factional conflict.
Provide a suitable 'title' and an in-game 'sourceAttribution'.
List any 'relatedEntities' (player IDs, faction IDs, zone IDs).
Assign relevant 'keywords' and a 'sentiment'.
Focus on making the world feel alive, responsive, and rich with history and emergent stories.
`,
});


export const weaveNarrativeFlow = ai.defineFlow(
  {
    name: 'weaveNarrativeFlow',
    inputSchema: NarrativeWeaverInputSchema,
    outputSchema: NarrativeWeaverOutputSchema,
  },
  async (input) => {
    console.log("Narrative Weaver: Crafting story from recent events. Output type:", input.outputType);
    const { output } = await narrativeWeaverPrompt(input);
     if (!output) {
        throw new Error("Narrative weaving process failed to produce an output.");
    }
    // Ensure a title if LLM forgets
    if (!output.title) {
        output.title = `${input.outputType.replace(/_/g, ' ')} - ${new Date().toISOString().slice(0,10)}`;
    }
    return output;
  }
);

export async function weaveNarrative(input: NarrativeWeaverInput): Promise<NarrativeWeaverOutput> {
  return weaveNarrativeFlow(input);
}

console.log("Genkit Flow for Narrative Weaver (apps/game-ai-genkit/src/flows/narrativeWeaver.ts) loaded.");
