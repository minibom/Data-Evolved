// packages/common-types/map.ts
// Defines shared TypeScript types/interfaces for map generation and data.
import { z } from 'zod';

// Input parameters for requesting AI map generation
export const MapGenerationParamsSchema = z.object({
  size: z.object({ 
    width: z.number().int().min(10).max(200).describe("Width of the map in tiles."), 
    height: z.number().int().min(10).max(200).describe("Height of the map in tiles.") 
  }),
  theme: z.enum([
      "urban_ruin", 
      "digital_forest", 
      "corrupted_wasteland", 
      "nexus_core", 
      "data_stream_caverns",
      "floating_islands_of_code",
      "glitched_reality_zone"
    ]).describe("The primary visual and thematic style of the map."),
  numZones: z.number().int().min(1).max(5).optional().default(1)
    .describe("Number of distinct zones or regions within the map."),
  resourceDensity: z.enum(["low", "medium", "high"]).optional().default("medium")
    .describe("Overall density of collectible resources."),
  enemyDensity: z.enum(["low", "medium", "high", "horde"]).optional().default("medium")
    .describe("Density of enemy spawn points."),
  pvpFocus: z.boolean().optional().default(false)
    .describe("If true, the map layout should favor player-versus-player encounters (e.g., choke points, objectives)."),
  difficulty: z.enum(["easy", "medium", "hard", "nightmare"]).optional().default("medium")
    .describe("Overall difficulty, influencing enemy types, resource scarcity, and environmental hazards."),
  customSeed: z.string().optional().describe("Optional seed for deterministic map generation if supported by the algorithm."),
  requiredFeatures: z.array(z.string()).optional().describe("List of features that MUST be present (e.g., 'boss_arena', 'hidden_path', 'faction_outpost')."),
});
export type MapGenerationParams = z.infer<typeof MapGenerationParamsSchema>;


// Structure for a single tile in the map data
export const TileSchema = z.object({
  type: z.string().describe("Type of the tile, e.g., 'floor_metal', 'wall_stone', 'water_deep', 'data_conduit_active'."),
  isWalkable: z.boolean().default(true).describe("Can entities walk on this tile?"),
  isTransparent: z.boolean().default(true).describe("Can entities see through this tile (for line of sight)?"),
  properties: z.record(z.any()).optional().describe("Custom properties, e.g., { 'hazard_type': 'electric', 'script_trigger': 'on_enter_reveal_secret' }."),
});
export type Tile = z.infer<typeof TileSchema>;

// Structure for an entity placed on the map
export const MapEntitySchema = z.object({
  id: z.string().optional().describe("Optional unique instance ID for this entity on the map."),
  type: z.string().describe("Type of entity, e.g., 'enemy_spawn_corrupted_drone', 'resource_node_datascrap_common', 'npc_quest_giver_alpha', 'interactive_terminal'."),
  x: z.number().int().describe("X-coordinate (tile grid)."),
  y: z.number().int().describe("Y-coordinate (tile grid)."),
  properties: z.record(z.any()).optional().describe("Entity-specific properties, e.g., { 'respawn_time_seconds': 60, 'quest_id_start': 'q_alpha_01' }."),
});
export type MapEntity = z.infer<typeof MapEntitySchema>;

// Structure for a defined zone within the map
export const MapZoneSchema = z.object({
  zoneId: z.string().describe("Unique identifier for this zone within the map."),
  name: z.string().optional().describe("Display name of the zone."),
  minX: z.number().int(),
  maxX: z.number().int(),
  minY: z.number().int(),
  maxY: z.number().int(),
  description: z.string().optional().describe("Lore or gameplay description of the zone."),
  factionControlDefault: z.string().optional().describe("Default controlling faction, if any (e.g., 'AICore', 'Hacker', 'Neutral')."),
  properties: z.record(z.any()).optional().describe("Zone-specific properties, e.g., { 'ambient_sfx': 'cave_drips', 'visual_effect': 'shimmering_data' }."),
});
export type MapZone = z.infer<typeof MapZoneSchema>;


// Output data structure for a procedurally generated map
export const GeneratedMapDataSchema = z.object({
  mapId: z.string().describe("Unique ID for this generated map instance."),
  seed: z.string().optional().describe("The seed value used for generation, if deterministic."),
  generationParams: MapGenerationParamsSchema.optional().describe("The parameters used to generate this map."),
  size: z.object({ width: z.number().int(), height: z.number().int() }).describe("Dimensions of the map in tiles."),
  theme: z.string().describe("The theme used for the map."),
  tiles: z.array(z.array(TileSchema)) // Using TileSchema now
    .describe("2D array of tile data. Each inner array is a row."),
  entities: z.array(MapEntitySchema).optional().describe("List of entities placed on the map."),
  zones: z.array(MapZoneSchema).optional().describe("Definitions of distinct zones within this map."),
  entryPoints: z.array(z.object({ 
      name: z.string().optional().default("default_entry"), 
      x: z.number().int(), 
      y: z.number().int() 
    }))
    .min(1, "Map must have at least one entry point.")
    .describe("Possible entry points for players/entities onto the map."),
  mapNotes: z.string().optional().describe("AI-generated notes about the map's design, challenges, or interesting features."),
  // Additional fields like pathfinding_grid (precomputed), lighting_info, etc. can be added.
  version: z.string().default("1.0").describe("Version of the map data structure."),
});
export type GeneratedMapData = z.infer<typeof GeneratedMapDataSchema>;


console.log("Common Map types (packages/common-types/map.ts) loaded.");
