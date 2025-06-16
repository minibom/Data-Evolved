// src/game-client/world/MapLayer.ts
import type { Tile } from './Tile';

// This interface represents a single layer of a map (e.g., ground, collision, objects).
// It's inspired by Tiled's layer structure but can also be used for AI-generated maps.
export interface MapLayer {
  name: string;         // Name of the layer (e.g., "Ground", "Collision", "Objects_NPCs").
  type: 'tilelayer' | 'objectgroup' | 'imagelayer' | string; // Type of layer. String for custom AI layers.
  
  // For 'tilelayer'
  tiles?: Tile[][];     // 2D array of tiles for this layer. Dimensions match map width/height.
                        // Note: Some layers might not have tile data directly (e.g., object groups).
  
  // For 'objectgroup'
  objects?: MapObject[]; // Array of objects placed on this layer.

  // Common properties
  visible: boolean;     // Is this layer currently visible?
  opacity: number;      // Opacity of the layer (0-1).
  
  // Flag for specific game logic (e.g., collision detection)
  collision?: boolean;   // True if this layer should be considered for collision detection.
                         // This could be a property set during map parsing.

  properties?: Record<string, any>; // Custom properties for the layer.
}

// Represents an object within an 'objectgroup' layer (e.g., spawn point, trigger area, NPC location)
export interface MapObject {
  id: number | string; // Unique ID for the object within the map.
  name?: string;        // Optional name for the object.
  type: string;         // Type of object (e.g., "SpawnPoint", "NPCHome", "TriggerArea", "ResourceNode").
  x: number;            // X-coordinate in pixels.
  y: number;            // Y-coordinate in pixels.
  width?: number;       // Width in pixels (for rectangular objects).
  height?: number;      // Height in pixels (for rectangular objects).
  rotation?: number;    // Rotation in degrees.
  gid?: number;         // If representing a tile object, its GID.
  visible?: boolean;
  properties?: Record<string, any>; // Custom properties for the object.
  // For polygons, polylines, ellipses, text objects, add relevant fields.
  // polygon?: {x: number, y: number}[];
  // text?: {text: string, fontfamily?: string, pixelsize?: number, color?: string};
}


console.log("MapLayer interface (src/game-client/world/MapLayer.ts) created.");
