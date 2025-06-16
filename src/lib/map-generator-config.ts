// /src/lib/map-generator-config.ts

// Default parameters for map generation, can be overridden by user/API call.
export const defaultMapGenerationConfig = {
  minWidth: 20,
  maxWidth: 100,
  minHeight: 20,
  maxHeight: 100,
  defaultNumZones: 1,
  maxZones: 5,
};

// Theme-specific configurations or weights
export const mapThemeConfigs = {
  urban_ruin: {
    tileWeights: { wall: 0.3, floor_concrete: 0.5, rubble: 0.1, road: 0.1 },
    entitySpawnRates: { enemy_drone: 0.05, resource_scrap: 0.02 },
    structureDensity: "medium",
    openness: "low", // 0-1, how open the map is vs corridors
  },
  digital_forest: {
    tileWeights: { tree_data: 0.4, floor_grass: 0.4, water_stream: 0.1, path_dirt: 0.1 },
    entitySpawnRates: { enemy_glitch_critter: 0.03, resource_crystal: 0.03 },
    structureDensity: "low",
    openness: "medium",
  },
  corrupted_wasteland: {
    tileWeights: { floor_cracked: 0.6, corrupted_ground: 0.2, toxic_pool: 0.1, rubble: 0.1 },
    entitySpawnRates: { enemy_mutant: 0.06, resource_rare_isotope: 0.01 },
    structureDensity: "sparse",
    openness: "high",
  },
  nexus_core: {
    tileWeights: { floor_metallic: 0.7, energy_conduit: 0.1, wall_secure: 0.2 },
    entitySpawnRates: { enemy_security_bot: 0.04, resource_energy_cell: 0.025 },
    structureDensity: "high", // Very structured, corridors
    openness: "low",
  },
  data_stream_caverns: {
    tileWeights: { floor_crystal_cave: 0.5, data_river: 0.2, wall_crystal: 0.3 },
    entitySpawnRates: { enemy_data_elemental: 0.04, resource_raw_data_node: 0.03 },
    structureDensity: "cavernous",
    openness: "medium", // Can have large caverns and tight tunnels
  }
};

// Other configuration parameters
export const mapGenerationParameters = {
  maxPathfindingRetries: 3, // For validator
  minResourceNodesPerZone: 2,
  minEnemySpawnsPerZone: 3,
};

console.log("Map Generator Config (src/lib/map-generator-config.ts) loaded.");
