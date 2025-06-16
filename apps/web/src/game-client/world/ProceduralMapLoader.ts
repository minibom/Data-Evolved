// src/game-client/world/ProceduralMapLoader.ts
import type { GeneratedMapData } from '@packages/common-types/map';
import type { GameClient } from '../index';
// Define EntitySpawnData if not in common-types (subset of MapEntitySchema)
type EntitySpawnData = { type: string; x: number; y: number; properties?: any };


export class ProceduralMapLoader {
  protected game: GameClient;

  constructor(game: GameClient) {
    this.game = game;
    console.log("ProceduralMapLoader initialized.");
  }

  public load(mapData: GeneratedMapData): void {
    console.log(`ProceduralMapLoader: Loading procedurally generated map ID ${mapData.mapId}`);
    
    // 1. Clear previous map elements (if any)
    // this.game.entityManager.clearMapEntities(); // Assuming an entity manager

    // 2. Pass tile data to MapManager or a TilemapRenderer
    this.game.getMapManager().loadMap(mapData); // MapManager handles parsing and setting up its internal state

    // 3. Spawn entities defined in mapData.entities
    if (mapData.entities && mapData.entities.length > 0) {
      this.placeEntities(mapData.entities as EntitySpawnData[]); // Cast if MapEntitySchema is richer
    }

    // 4. Set player start position
    if (mapData.entryPoints && mapData.entryPoints.length > 0) {
      const entryPoint = mapData.entryPoints[0];
      // const player = this.game.player; // Assuming GameClient has a player reference
      // if (player) {
      //   const TILE_WIDTH = 32; const TILE_HEIGHT = 32; // Get from mapData or constants
      //   player.x = entryPoint.x * TILE_WIDTH + TILE_WIDTH / 2;
      //   player.y = entryPoint.y * TILE_HEIGHT + TILE_HEIGHT / 2;
      //   console.log(`Player position set to map entry point: (${player.x}, ${player.y})`);
      // }
       console.log(`Player start for map ${mapData.mapId} would be at grid (${entryPoint.x}, ${entryPoint.y}).`);
    }

    // 5. Apply map-specific settings or trigger initial events
    if (mapData.mapNotes) {
      console.log("Map Notes from AI:", mapData.mapNotes);
      // this.game.uiManager.showNotification("Map Insight", mapData.mapNotes);
    }
    
    console.log(`ProceduralMapLoader: Map ${mapData.mapId} setup complete.`);
  }

  // This method might be redundant if MapManager handles tile rendering
  public renderTiles(tiles: string[][]): void { // Assuming tiles is a simple 2D array of tile types
    console.log("ProceduralMapLoader: Rendering tiles (Conceptual, likely handled by MapManager/TilemapRenderer).", tiles);
    // Actual rendering logic would iterate through tiles and draw them using AssetManager
  }

  public placeEntities(entities: EntitySpawnData[]): void {
    console.log("ProceduralMapLoader: Placing entities.", entities);
    entities.forEach(entityData => {
      // Convert grid coords to world coords if necessary
      // const TILE_WIDTH = 32; const TILE_HEIGHT = 32; // Get from mapData or constants
      // const worldX = entityData.x * TILE_WIDTH + TILE_WIDTH / 2;
      // const worldY = entityData.y * TILE_HEIGHT + TILE_HEIGHT / 2;
      // this.game.entityManager.spawnEntity(entityData.type, worldX, worldY, entityData.properties);
      console.log(`  - Spawning entity type '${entityData.type}' at grid (x:${entityData.x}, y:${entityData.y})`);
    });
  }
}

console.log("ProceduralMapLoader class (src/game-client/world/ProceduralMapLoader.ts) updated.");
