// /src/game-client/world/ProceduralMapLoader.ts
// Responsible for interpreting AI-generated map data and rendering it in the game client.
import type { GeneratedMapData } from '@packages/common-types/map';
// import type { GameClient } from '../index';
// import { TilemapRenderer } from './TilemapRenderer'; // If using a dedicated tilemap renderer

export class ProceduralMapLoader {
  private gameClient: any; // GameClient instance
  // private tilemapRenderer: TilemapRenderer; // Optional, for advanced rendering

  constructor(gameClient: any /* GameClient */) {
    this.gameClient = gameClient;
    // this.tilemapRenderer = new TilemapRenderer(gameClient);
    console.log("ProceduralMapLoader initialized.");
  }

  public async loadMap(mapData: GeneratedMapData): Promise<void> {
    console.log(`ProceduralMapLoader: Loading map ID ${mapData.mapId} with theme ${mapData.theme}`);
    
    // 1. Clear previous map data/entities if any
    // this.gameClient.clearCurrentWorldState(); // Hypothetical method on GameClient

    // 2. Process and set up tile data for rendering
    // This would involve passing mapData.tiles and tileset information to a MapManager or TilemapRenderer
    // For example:
    // const mapManager = this.gameClient.getSystem('MapManager');
    // mapManager.loadFromProceduralData(mapData); // Method to load from GeneratedMapData structure
    
    // If using a dedicated tilemap renderer:
    // await this.tilemapRenderer.prepareTilesets(mapData.tilesets); // Assuming tileset info is part of GeneratedMapData
    // this.tilemapRenderer.setCurrentTileData(mapData.tiles);
    
    console.log("ProceduralMapLoader: Tile data processed (simulated).");

    // 3. Spawn entities defined in mapData.entities
    if (mapData.entities) {
      for (const entityData of mapData.entities) {
        // this.gameClient.entityManager.spawnEntity(entityData.type, entityData.x, entityData.y, entityData.properties);
        console.log(`ProceduralMapLoader: Spawning entity type '${entityData.type}' at (${entityData.x}, ${entityData.y}) (simulated).`);
      }
    }

    // 4. Set player start position
    if (mapData.entryPoints && mapData.entryPoints.length > 0) {
      const entryPoint = mapData.entryPoints[0]; // Use the first entry point
      // this.gameClient.getPlayer().setPosition(entryPoint.x * TILE_WIDTH, entryPoint.y * TILE_HEIGHT); // Convert grid to world coords
      console.log(`ProceduralMapLoader: Player start position set to (${entryPoint.x}, ${entryPoint.y}) (grid coordinates, simulated).`);
    }

    // 5. Apply any map-specific settings or trigger initial map events
    if (mapData.mapNotes) {
        console.log("Map Notes from AI:", mapData.mapNotes);
        // this.gameClient.uiManager.showNotification("Map Insight", mapData.mapNotes);
    }
    
    console.log(`ProceduralMapLoader: Map ${mapData.mapId} setup complete.`);
  }

  // This method would be called by the GameLoop to draw the map
  public render(renderer: CanvasRenderingContext2D | any): void {
    // if (this.tilemapRenderer && this.tilemapRenderer.hasMapData()) {
    //   this.tilemapRenderer.renderActiveLayers(renderer);
    // } else {
    //   // Fallback or simple rendering if not using TilemapRenderer
    //   console.log("ProceduralMapLoader: Render call (no actual rendering implemented yet).");
    // }
  }
}

console.log("ProceduralMapLoader class (src/game-client/world/ProceduralMapLoader.ts) loaded.");
