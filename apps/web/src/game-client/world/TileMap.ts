// src/game-client/world/TileMap.ts
import type { Tile } from './Tile';
import type { MapLayer } from './MapLayer';

// This is primarily a data structure interface, not a class with complex logic.
// It represents the game client's internal understanding of a map.
export interface TileMap {
  tiles: Tile[][]; // 2D array of Tile objects, representing the primary display layer or a composite.
  width: number; // Width of the map in number of tiles.
  height: number; // Height of the map in number of tiles.
  tileWidth: number; // Pixel width of a single tile.
  tileHeight: number; // Pixel height of a single tile.
  layers: MapLayer[]; // Array of all layers in the map (tile layers, object layers, etc.).
  
  // Optional properties for more detailed map data
  collisionLayer?: boolean[][]; // A simplified grid for quick collision checks.
  entryPoints?: { x: number, y: number, name?: string }[]; // Pre-defined entry points in tile coordinates.
  mapId?: string; // ID if loaded from GeneratedMapData or static file.
  theme?: string; // Theme of the map.
}

console.log("TileMap interface (src/game-client/world/TileMap.ts) created.");
