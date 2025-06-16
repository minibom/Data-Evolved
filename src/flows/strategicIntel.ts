// src/flows/strategicIntel.ts
'use server';
/**
 * @fileOverview Genkit flow for providing personalized strategic intel to players.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const StrategicIntelInputSchema = z.object({
  playerId: z.string().describe("The ID of the player requesting intel."),
  playerFaction: z.enum(["AICore", "Hacker", "Neutral"]).optional().describe("Player's faction."),
  playerGHZ: z.number().int().describe("Player's current GHZ (processing power/level)."),
  playerCurrentZone: z.string().optional().describe("The zone the player is currently in or interested in."),
  playerGoals: z.array(z.string()).optional().describe("Player's stated short-term goals (e.g., 'Gain more Data Scraps', 'Help my faction capture Zone X', 'Find a rare weapon module')."),
  currentWorldEvents: z.array(z.object({ name: z.string(), description: z.string(), affectedZones: z.array(z.string()).optional() })).optional().describe("Summary of active world events."),
  factionDirectives: z.record(z.string()).optional().describe("Current high-level directives for relevant factions (e.g., AICore: 'Secure Zone Y', Anonymous: 'Disrupt trade in Zone Z')."),
});
export type StrategicIntelInput = z.infer<typeof StrategicIntelInputSchema>;

export const StrategicIntelOutputSchema = z.object({
  intelBriefing: z.string().describe("A concise summary of the current strategic situation relevant to the player."),
  suggestedActions: z.array(z.object({
    action: z.string().describe("A specific, actionable suggestion (e.g., 'Patrol Sector Gamma in Zone X for Corrupted Entities', 'Contribute Data Scraps to your faction's war effort in Zone Y', 'Seek out NPC Z for a quest related to event A')."),
    reasoning: z.string().describe("Why this action is suggested."),
    potentialOutcome: z.string().optional().describe("Possible positive outcome of taking this action."),
  })).min(1).max(3).describe("1-3 concrete strategic suggestions for the player."),
  threatAssessment: z.string().optional().describe("Brief assessment of immediate threats or opportunities."),
  resourceHotspots: z.array(z.string()).optional().describe("Names or locations of potential resource hotspots."),
});
export type StrategicIntelOutput = z.infer<typeof StrategicIntelOutputSchema>;

const strategicIntelPrompt = ai.definePrompt({
  name: 'strategicIntelPrompt',
  input: { schema: StrategicIntelInputSchema },
  output: { schema: StrategicIntelOutputSchema },
  prompt: `You are a Strategic Intelligence AI for "Data Evolved", providing personalized advice to players.

Player Profile:
- ID: {{{playerId}}}
- Faction: {{{playerFaction | default "Neutral"}}}
- GHZ: {{{playerGHZ}}}
{{#if playerCurrentZone}}- Current Zone Focus: {{{playerCurrentZone}}}{{/if}}
{{#if playerGoals.length}}- Player Goals: {{#each playerGoals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

Current Game State:
{{#if currentWorldEvents.length}}
Active World Events:
{{#each currentWorldEvents}}
  - {{name}}: {{description}} {{#if affectedZones}}(Affects: {{#each affectedZones}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}){{/if}}
{{/each}}
{{/if}}
{{#if factionDirectives}}
Faction Directives:
{{#each factionDirectives}}
  - {{@key}}: {{{this}}}
{{/each}}
{{/if}}

Based on the player's profile and the current game state, provide:
1.  A concise Intel Briefing relevant to the player.
2.  1-3 specific, actionable Suggested Actions with reasoning and potential outcomes. These should align with player goals and faction, if applicable.
3.  A brief Threat Assessment or opportunity highlight.
4.  Optionally, mention any Resource Hotspots if relevant.

Your advice should be strategic, helpful, and tailored to this specific player.
If the player is Neutral, suggestions might focus on exploration, self-improvement, or understanding the conflict.
If the player has a faction, suggestions should align with typical faction objectives or current directives.
`,
});

export const getStrategicIntelFlow = ai.defineFlow(
  {
    name: 'getStrategicIntelFlow',
    inputSchema: StrategicIntelInputSchema,
    outputSchema: StrategicIntelOutputSchema,
  },
  async (input) => {
    console.log(`Generating strategic intel for player: ${input.playerId}`);
    const { output } = await strategicIntelPrompt(input);
    if (!output) {
        throw new Error("Strategic intel generation failed to produce an output.");
    }
    return output;
  }
);

export async function getStrategicIntel(input: StrategicIntelInput): Promise<StrategicIntelOutput> {
  return getStrategicIntelFlow(input);
}

console.log("Genkit Flow for Strategic Intel (src/flows/strategicIntel.ts) loaded.");
