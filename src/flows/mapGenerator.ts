'use server';
/**
 * @fileOverview Genkit Flow for AI Procedural Map Generation.
 * This flow is responsible for generating new game maps based on input parameters.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod'; // Zod is already available via Genkit
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
Refer to available map generation templates and tile rules for guidance on structure and tile placement logic.

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
The 'tiles' output should be a 2D array of Tile objects, where each Tile object has 'type', 'isWalkable', and 'isTransparent' properties.
Define 'entities' like spawn points, resource nodes, or quest givers using the MapEntity schema.
Define 'zones' using the MapZone schema if numZones > 1, ensuring minX, maxX, minY, maxY are within map boundaries.
Ensure there's at least one 'entryPoint' in the 'entryPoints' array, with x, y coordinates within map boundaries. The 'name' is optional.
Provide 'mapNotes' if there's anything special about the map's design, challenges, or features.
Adhere to general principles of good map design (e.g., clear paths, interesting choke points if PvP focused, logical resource placement).
The output MUST be a valid JSON object matching the GeneratedMapData schema.
Ensure all tile coordinates for entities and entry points are within the map dimensions (0 to width-1, 0 to height-1).
For 'tiles', each inner array represents a row, and should contain 'size.width' Tile objects. There should be 'size.height' rows.
Example Tile: { "type": "floor_grass", "isWalkable": true, "isTransparent": true }
Example Entity: { "type": "resource_node_common", "x": 5, "y": 10 }
Example Zone: { "zoneId": "zone1_ruins", "name": "Ancient Ruins", "minX": 0, "maxX": 10, "minY": 0, "maxY": 10 }
Example Entry Point: { "x": 1, "y": 1, "name": "default_start" }
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
    const augmentedParams = { ...params, timestamp_ms: Date.now() };
    const { output } = await mapGeneratorPrompt(augmentedParams);

    if (!output) {
      throw new Error("Map generation AI failed to produce an output.");
    }
    
    // Ensure critical fields are present and somewhat valid, complementing Zod schema validation
    if (!output.mapId || !output.mapId.startsWith("map_")) {
        output.mapId = `map_${params.theme}_${params.size.width}x${params.size.height}_${Date.now()}`;
        console.warn("AI output missing or invalid mapId, generating one.");
    }
    if (!output.tiles || output.tiles.length !== params.size.height || (output.tiles[0] && output.tiles[0].length !== params.size.width) ) {
        console.error("AI output 'tiles' dimensions do not match input size parameters.");
        // Potentially throw error or attempt to fix, but for now, log and proceed with potentially invalid data
        // This should ideally be caught by Zod schema if strict enough, or by the validator later
    }
    if (!output.entryPoints || output.entryPoints.length === 0) {
        console.warn("AI output missing entryPoints, adding a default fallback.");
        output.entryPoints = [{x: Math.floor(params.size.width/2), y: Math.floor(params.size.height/2), name:"default_fallback_entry"}];
    }
    output.generationParams = params; // Ensure the params used are part of the output.
    output.theme = params.theme; // Ensure theme is correctly set from input.
    output.size = params.size; // Ensure size is correctly set from input.

    return output;
  }
);

export async function generateMap(params: MapGenerationParams): Promise<GeneratedMapData> {
  return generateMapFlow(params);
}

console.log("Genkit Flow for Procedural Map Generation (src/flows/mapGenerator.ts) loaded and updated with detailed schemas.");
