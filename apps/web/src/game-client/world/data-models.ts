// apps/web/src/game-client/world/data-models.ts
/**
 * This file is intended to define TypeScript interfaces or classes
 * that represent the structure of map data as used and interpreted
 * by the game client. This could include client-side representations
 * of tiles, layers, map objects, and zone information specifically
 * tailored for rendering or client-side game logic.
 *
 * It might overlap or extend types from `packages/common-types/map.ts`
 * or `apps/web/src/game-client/world/TileMap.ts`, `Tile.ts`, `MapLayer.ts`.
 *
 * For now, it serves as a placeholder. The primary map data structures
 * are currently defined in `packages/common-types/map.ts` (for AI generation output)
 * and as interfaces in `TileMap.ts`, `Tile.ts`, `MapLayer.ts` (for client-side representation).
 */

export interface ClientTileData {
  // Example: Could be a more processed version of the common Tile type
  textureId: string; // ID for the specific texture in a tileset
  isWalkable: boolean;
  hasCollision: boolean;
  // Client-specific rendering properties
  animationKey?: string;
  tint?: number; // e.g., 0xFF0000 for red tint
}

export interface ClientMapObject {
  id: string;
  type: string; // e.g., 'npc_spawn', 'resource_node', 'trigger_area'
  worldX: number;
  worldY: number;
  properties: Record<string, any>;
  // Client-specific representation for rendering (e.g., a sprite instance, a geometric shape)
  renderableObject?: any; // Placeholder for PIXI.Sprite, THREE.Mesh, etc.
}

export interface ClientMapLayer {
  name: string;
  tiles?: ClientTileData[][]; // For tile layers
  objects?: ClientMapObject[]; // For object layers
  isVisible: boolean;
  zIndex: number; // For rendering order
}

export interface ClientMapRepresentation {
  mapId: string;
  theme: string;
  widthInTiles: number;
  heightInTiles: number;
  tilePixelWidth: number;
  tilePixelHeight: number;
  layers: ClientMapLayer[];
  // Other client-specific map properties, like background music key, ambient effects, etc.
}

console.log("Client-side map data models (apps/web/src/game-client/world/data-models.ts) - Placeholder content.");
