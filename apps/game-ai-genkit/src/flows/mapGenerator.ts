
'use server';
/**
 * @fileOverview Genkit Flow for AI Procedural Map Generation.
 * This flow is responsible for generating new game maps based on input parameters.
 */
import {ai} from '../../../game-ai-genkit/genkit'; // Adjusted path
import {z} from 'zod'; 
import { 
    MapGenerationParamsSchema,
    GeneratedMapDataSchema,
    type MapGenerationParams,
    type GeneratedMapData
} from '@packages/common-types/map';

const mapGeneratorPrompt = ai.definePrompt({
  name: 'mapGeneratorPrompt',
  input: { schema: MapGenerationParamsSchema },
  output: { schema: GeneratedMapDataSchema },
  prompt: `You are a Procedural Map Generation AI for the game "Data Evolved".
Your task is to design a new game map based on the provided parameters.
The map should be playable, interesting, and adhere to the specified theme and constraints.
Refer to available map generation templates (e.g., from data/map_generation_templates.json) and tile rules (e.g., from data/tile_rules.json) for guidance on structure and tile placement logic.

Map Generation Parameters:
- Size: Width: {{{size.width}}}, Height: {{{size.height}}}
- Theme: {{{theme}}}
- Number of Zones: {{{numZones}}}
- Resource Density: {{{resourceDensity}}}
- Enemy Density: {{{enemyDensity}}}
- PvP Focus: {{{pvpFocus}}}
- Difficulty: {{{difficulty}}}
{{#if customSeed}}- Custom Seed: {{{customSeed}}}{{/if}}
{{#if requiredFeatures.length}}- Required Features: {{#each requiredFeatures}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

Generate a unique mapId using the format: map_{{{theme}}}_{{{size.width}}}x{{{size.height}}}_{{timestamp_ms}}.
The 'tiles' output MUST be a 2D array of Tile objects. Each inner array represents a row of tiles and must have 'size.width' Tile objects. There must be 'size.height' rows.
Each Tile object MUST have 'type' (string), 'isWalkable' (boolean), and 'isTransparent' (boolean) properties. It can optionally have a 'properties' object.
Define 'entities' (optional array of MapEntity objects) like spawn points, resource nodes, or quest givers. Each entity MUST have 'type' (string), 'x' (integer grid coord), 'y' (integer grid coord).
Define 'zones' (optional array of MapZone objects) if numZones > 1. Each zone MUST have 'zoneId' (string), 'minX', 'maxX', 'minY', 'maxY' (all integer grid coords).
Ensure there's AT LEAST ONE 'entryPoint' in the 'entryPoints' array. Each entryPoint MUST have 'x' (integer grid coord) and 'y' (integer grid coord).
Provide 'mapNotes' (string, optional) if there's anything special about the map's design, challenges, or features.

Adhere to general principles of good map design (e.g., clear paths, interesting choke points if PvP focused, logical resource placement).
The output MUST be a valid JSON object matching the GeneratedMapData schema.
Ensure all tile coordinates for entities, zones, and entry points are within the map dimensions (0 to width-1, 0 to height-1).

Example Tile: { "type": "floor_grass", "isWalkable": true, "isTransparent": true }
Example Entity: { "type": "resource_node_common", "x": 5, "y": 10 }
Example Zone: { "zoneId": "zone1_ruins", "name": "Ancient Ruins", "minX": 0, "maxX": 10, "minY": 0, "maxY": 10 }
Example Entry Point: { "x": 1, "y": 1, "name": "default_start" }

Focus on structural integrity and adherence to the output schema.
`,
});

export const generateMapFlow = ai.defineFlow(
  {
    name: 'generateMapFlow',
    inputSchema: MapGenerationParamsSchema,
    outputSchema: GeneratedMapDataSchema,
  },
  async (params) => {
    console.log("AI Map Generator: Generating map with params:", params);
    // Augment params for use in the prompt template (e.g., timestamp for unique ID generation)
    const augmentedParams = { ...params, timestamp_ms: Date.now() };
    const {output} = await mapGeneratorPrompt(augmentedParams);

    if (!output) {
      throw new Error("Map generation AI failed to produce an output.");
    }
    
    // Basic post-processing and validation (more can be added in map-validator.ts)
    if (!output.mapId || !output.mapId.startsWith("map_")) {
        output.mapId = `map_${params.theme}_${params.size.width}x${params.size.height}_${Date.now()}`;
        console.warn("AI output missing or invalid mapId, generating a new one.");
    }
    if (!output.tiles || output.tiles.length !== params.size.height || (output.tiles[0] && output.tiles[0].length !== params.size.width) ) {
        console.error("CRITICAL: AI output 'tiles' dimensions do not match input size parameters. This can break client rendering.");
        // Potentially throw error or attempt to fix by padding/truncating, though risky.
        // For now, it will proceed, but `map-validator.ts` should catch this.
    }
    if (!output.entryPoints || output.entryPoints.length === 0) {
        console.warn("AI output missing entryPoints, adding a default fallback at map center.");
        output.entryPoints = [{x: Math.floor(params.size.width/2), y: Math.floor(params.size.height/2), name:"default_fallback_entry"}];
    }
    
    // Ensure the output always includes the parameters it was generated with for traceability
    output.generationParams = params;
    output.theme = params.theme;
    output.size = params.size;
    output.version = output.version || "1.0";


    return output;
  }
);

// Exported wrapper function for ease of use (consistent with other flows)
export async function generateMap(params: MapGenerationParams): Promise<GeneratedMapData> {
  return generateMapFlow(params);
}

console.log("Genkit Flow for Procedural Map Generation (apps/game-ai-genkit/src/flows/mapGenerator.ts) loaded and updated with detailed schemas.");
