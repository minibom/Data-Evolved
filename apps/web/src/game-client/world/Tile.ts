// src/game-client/world/Tile.ts

// This is a data structure interface for a single tile on the map.
// It corresponds to what might be in mapData.tiles[y][x] from GeneratedMapData.
export interface Tile {
  type: string;         // e.g., "floor_grass", "wall_stone", "water_deep", "data_conduit_active"
                        // This type string would map to specific graphics in AssetManager or Tileset.
  isWalkable: boolean;  // Can entities pathfind or move onto this tile?
  isTransparent: boolean; // For line-of-sight calculations. True if vision passes through.
  properties?: Record<string, any>; // Custom properties from Tiled or AI generation
                                    // e.g., { "hazard_type": "electric", "script_trigger": "on_enter_reveal_secret", "movement_cost": 2 }
  
  // Optional rendering specific info (could be derived from 'type' and tileset data)
  tilesetGid?: number; // Global ID if from a Tiled map tileset
  textureName?: string; // Direct texture name if not using GID system
  animation?: any; // Animation details if the tile is animated
}

console.log("Tile interface (src/game-client/world/Tile.ts) created.");
