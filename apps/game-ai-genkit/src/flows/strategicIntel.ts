// apps/game-ai-genkit/src/flows/strategicIntel.ts
'use server';
/**
 * @fileOverview Genkit flow for providing personalized strategic intel to players.
 * This AI analyzes player status, world events, and faction goals to offer tailored advice.
 */
import { ai } from '../../../game-ai-genkit/genkit'; // Adjusted path
import { z } from 'genkit';

export const StrategicIntelInputSchema = z.object({
  playerId: z.string().describe("The ID of the player requesting intel."),
  playerProfile: z.object({
    level: z.number().int().min(1).describe("Player's current level."),
    ghz: z.number().int().describe("Player's current GHZ (processing power)."),
    factionId: z.enum(["AICore", "Hacker", "Neutral"]).optional().describe("Player's faction allegiance."),
    currentZoneId: z.string().optional().describe("The zone the player is currently in or most recently active."),
    activeQuestIds: z.array(z.string()).max(5).optional().describe("IDs of the player's most important active quests."),
    recentAchievements: z.array(z.string()).max(3).optional().describe("IDs of recently unlocked significant achievements."),
    shortTermGoals: z.array(z.string()).max(3).optional().describe("Player's stated short-term goals (e.g., 'Gain more Data Scraps', 'Help my faction capture Zone X', 'Find a rare weapon module')."),
  }).describe("Detailed profile of the player requesting intel."),
  currentWorldState: z.object({
    activeWorldEvents: z.array(z.object({
      name: z.string().describe("Name of the world event."),
      description: z.string().describe("Brief summary of the event."),
      affectedZones: z.array(z.string()).optional().describe("Zone IDs affected by this event."),
      relevanceToPlayerFaction: z.string().optional().describe("How this event might specifically impact the player's faction."),
    })).max(3).optional().describe("Summary of up to 3 major active world events."),
    factionSpecificDirectives: z.record(z.string()).optional().describe("Current high-level directives for relevant factions (e.g., AICore: 'Secure Zone Y for resource harvesting', Anonymous: 'Disrupt AI Core communications in Zone Z'). Key is factionId."),
    zoneHotspots: z.array(z.object({
        zoneId: z.string(),
        activityType: z.string().describe("e.g., 'High PvP Conflict', 'Rare Resource Surge', 'Anomaly Outbreak', 'New Quest Chain Started'"),
        details: z.string().optional(),
    })).max(5).optional().describe("Up to 5 zones with notable ongoing activity."),
  }).describe("Overview of the current state of the game world."),
});
export type StrategicIntelInput = z.infer<typeof StrategicIntelInputSchema>;

export const StrategicIntelOutputSchema = z.object({
  intelBriefingTitle: z.string().default("Strategic Intel Briefing").describe("A concise title for the briefing."),
  personalizedSummary: z.string().describe("A concise summary of the current strategic situation highly relevant to THIS player, considering their profile and goals within the world state."),
  suggestedActions: z.array(z.object({
    actionTitle: z.string().describe("A short, catchy title for the suggested action."),
    actionDescription: z.string().describe("A specific, actionable suggestion (e.g., 'Investigate the anomaly surge in Zone Beta Sector 3', 'Contribute Data Scraps to the AI Core war effort in Nexus Hub Alpha to unlock faction rewards', 'Seek out NPC 'DataBrokerX' in the Shadow Market for a lead on your active quest 'The Glitched Key'')."),
    reasoning: z.string().describe("Why this action is tactically sound for the player, linking to their goals, faction, or current events."),
    potentialOutcome: z.string().optional().describe("Possible positive outcome or benefit of taking this action (e.g., 'May lead to rare resource discovery', 'Could significantly boost faction standing', 'Might unlock a hidden area')."),
    priority: z.enum(["low", "medium", "high"]).default("medium").describe("Suggested priority for this action."),
  })).min(1).max(3).describe("1-3 concrete strategic suggestions for the player."),
  threatAssessment: z.string().optional().describe("Brief assessment of immediate threats or significant opportunities the player should be aware of in their vicinity or related to their goals."),
  resourceHotspotsRelevant: z.array(z.string()).optional().describe("Names or locations of potential resource hotspots specifically relevant to the player's current needs or goals."),
  intelTimestamp: z.string().datetime().describe("Timestamp when this intel was generated."),
});
export type StrategicIntelOutput = z.infer<typeof StrategicIntelOutputSchema>;

const strategicIntelPrompt = ai.definePrompt({
  name: 'strategicIntelPrompt',
  input: { schema: StrategicIntelInputSchema },
  output: { schema: StrategicIntelOutputSchema },
  prompt: `You are "NexusOracle", a Strategic Intelligence AI for the game "Data Evolved".
Your mission is to provide highly personalized and actionable strategic advice to a specific player.

Player Profile:
- ID: {{{playerId}}}
- Level: {{{playerProfile.level}}}, GHZ: {{{playerProfile.ghz}}}
- Faction: {{{playerProfile.factionId | default "Neutral"}}}
{{#if playerProfile.currentZoneId}}- Current/Recent Zone: {{{playerProfile.currentZoneId}}}{{/if}}
{{#if playerProfile.activeQuestIds.length}}- Active Quests: {{#each playerProfile.activeQuestIds}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if playerProfile.recentAchievements.length}}- Recent Achievements: {{#each playerProfile.recentAchievements}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if playerProfile.shortTermGoals.length}}- Player Goals: {{#each playerProfile.shortTermGoals}}{{{this}}}{{#unless @last}}; {{/unless}}{{/each}}{{/if}}

Current Game World State:
{{#if currentWorldState.activeWorldEvents.length}}
Active World Events:
{{#each currentWorldState.activeWorldEvents}}  - {{name}}: {{description}} {{#if affectedZones}}(Affects: {{#each affectedZones}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}){{/if}} {{#if relevanceToPlayerFaction}}(Faction Relevance: {{relevanceToPlayerFaction}}){{/if}}
{{/each}}
{{else}}- World state appears stable, no major global events currently active.{{/if}}

{{#if currentWorldState.factionSpecificDirectives}}
Faction Directives:
{{#each currentWorldState.factionSpecificDirectives}}  - {{@key}}: {{{this}}}
{{/each}}
{{/if}}

{{#if currentWorldState.zoneHotspots.length}}
Zone Hotspots:
{{#each currentWorldState.zoneHotspots}}  - Zone {{zoneId}}: {{activityType}} {{#if details}}({{details}}){{/if}}
{{/each}}
{{/if}}

Based on THIS player's profile and the current game state, provide:
1.  'intelBriefingTitle': A short, relevant title.
2.  'personalizedSummary': A concise summary of the strategic situation tailored to THIS player.
3.  'suggestedActions' (1-3 actions): Each with 'actionTitle', 'actionDescription', 'reasoning', 'potentialOutcome', and 'priority'. These actions should be specific, actionable, and relevant to the player's level, faction, goals, and the current world events/hotspots. If the player is Neutral, suggestions might focus on exploration, self-improvement, or understanding the conflict. If faction-aligned, suggestions should align with faction objectives or directives.
4.  'threatAssessment' (optional): Brief assessment of immediate threats or opportunities.
5.  'resourceHotspotsRelevant' (optional): Mention any resource hotspots highly relevant to the player.
6.  'intelTimestamp': Set to the current ISO datetime.

Your advice must be strategic, insightful, and directly useful to THIS player. Avoid generic advice.
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
    output.intelTimestamp = new Date().toISOString(); // Ensure timestamp is set
    return output;
  }
);

export async function getStrategicIntel(input: StrategicIntelInput): Promise<StrategicIntelOutput> {
  return getStrategicIntelFlow(input);
}

console.log("Genkit Flow for Strategic Intel (apps/game-ai-genkit/src/flows/strategicIntel.ts) loaded.");
