'use server';
/**
 * @fileOverview Genkit Flow for AI Procedural Map Generation.
 * This flow is responsible for generating new game maps based on input parameters.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { MapGenerationParams, GeneratedMapData } from '@packages/common-types/map'; // Will be created

// Placeholder schemas, will be fleshed out in @packages/common-types/map.ts
export const MapGenerationParamsSchema = z.object({
  size: z.object({ width: z.number().int().min(10), height: z.number().int().min(10) }),
  theme: z.enum(["urban_ruin", "digital_forest", "corrupted_wasteland", "nexus_core", "data_stream_caverns"]),
  numZones: z.number().int().min(1).max(5).optional().default(1),
  resourceDensity: z.enum(["low", "medium", "high"]).optional().default("medium"),
  pvpFocus: z.boolean().optional().default(false),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().default("medium"),
});

export const GeneratedMapDataSchema = z.object({
  mapId: z.string().describe("Unique ID for the generated map."),
  seed: z.string().optional().describe("The seed used for generation, if applicable."),
  size: z.object({ width: z.number(), height: z.number() }),
  theme: z.string(),
  tiles: z.array(z.array(z.string())).describe("2D array representing tile types (e.g., 'floor', 'wall', 'water')."),
  entities: z.array(z.object({
    type: z.string().describe("e.g., 'enemy_spawn_point', 'resource_node', 'npc_start_location'"),
    x: z.number().int(),
    y: z.number().int(),
    properties: z.record(z.any()).optional(),
  })).optional(),
  zoneBoundaries: z.array(z.object({
    zoneId: z.string(),
    minX: z.number().int(),
    maxX: z.number().int(),
    minY: z.number().int(),
    maxY: z.number().int(),
    name: z.string().optional(),
  })).optional(),
  entryPoints: z.array(z.object({ x: z.number().int(), y: z.number().int(), name: z.string().optional() })).optional().default([{x:1, y:1, name: "default_start"}]),
  mapNotes: z.string().optional().describe("Notes from the AI about the map's features or challenges."),
});


const mapGeneratorPrompt = ai.definePrompt({
  name: 'mapGeneratorPrompt',
  input: { schema: MapGenerationParamsSchema },
  output: { schema: GeneratedMapDataSchema },
  prompt: `You are a Procedural Map Generation AI for the game "Data Evolved".
Your task is to design a new game map based on the provided parameters.
The map should be playable, interesting, and adhere to the specified theme and constraints.
Use data from map_generation_templates.json and tile_rules.json for guidance on structure and tile placement.

Map Generation Parameters:
- Size: Width: {{{size.width}}}, Height: {{{size.height}}}
- Theme: {{{theme}}}
- Number of Zones: {{{numZones}}}
- Resource Density: {{{resourceDensity}}}
- PvP Focus: {{{pvpFocus}}}
- Difficulty: {{{difficulty}}}

Generate a unique mapId (e.g., map_{{{theme}}}_{{{size.width}}}x{{{size.height}}}_{{timestamp_ms}}).
The 'tiles' output should be a 2D array of strings representing tile types.
Define 'entities' like spawn points, resource nodes, or quest givers.
Define 'zoneBoundaries' if numZones > 1.
Ensure there's at least one 'entryPoint'.
Provide 'mapNotes' if there's anything special about the map.
Adhere to general principles of good map design (e.g., clear paths, interesting choke points if PvP focused, logical resource placement).
The output must be a valid JSON object matching the GeneratedMapData schema.
`,
});

export const generateMapFlow = ai.defineFlow(
  {
    name: 'generateMapFlow',
    inputSchema: MapGenerationParamsSchema, // To be imported or defined from @packages/common-types/map
    outputSchema: GeneratedMapDataSchema,  // To be imported or defined from @packages/common-types/map
  },
  async (params) => {
    console.log("AI Map Generator: Generating map with params:", params);
    const augmentedParams = { ...params, timestamp_ms: Date.now() };
    const { output } = await mapGeneratorPrompt(augmentedParams);

    if (!output) {
      throw new Error("Map generation AI failed to produce an output.");
    }
    // Basic validation for schema compliance, more complex validation in map-validator.ts
    if (!output.mapId || !output.tiles || !output.size) {
        // Construct a more unique ID if LLM fails
        output.mapId = `map_${params.theme}_${params.size.width}x${params.size.height}_${Date.now()}`;
        console.warn("AI output might be missing fields, ensuring mapId is set.");
    }
    if (!output.entryPoints || output.entryPoints.length === 0) {
        output.entryPoints = [{x:1, y:1, name:"default_start_fallback"}]; // Ensure at least one entry point
    }
    return output;
  }
);

export async function generateMap(params: MapGenerationParams): Promise<GeneratedMapData> {
  return generateMapFlow(params);
}

console.log("Genkit Flow for Procedural Map Generation (src/flows/mapGenerator.ts) loaded.");
