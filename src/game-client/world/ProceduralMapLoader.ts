// /src/game-client/world/ProceduralMapLoader.ts
// Responsible for interpreting AI-generated map data and rendering it in the game client.
import type { GeneratedMapData } from '@packages/common-types/map';
// import type { GameClient } from '../index'; // Main game client class
// import { TilemapRenderer } from './TilemapRenderer'; // If using a dedicated tilemap renderer
// import { TILE_WIDTH, TILE_HEIGHT } from '@/lib/constants'; // Assuming tile size constants

export class ProceduralMapLoader {
  private gameClient: any; // GameClient instance
  // private tilemapRenderer: TilemapRenderer; // Optional, for advanced rendering

  constructor(gameClient: any /* GameClient */) {
    this.gameClient = gameClient;
    // this.tilemapRenderer = new TilemapRenderer(gameClient); // Pass GameClient for asset loading
    console.log("ProceduralMapLoader initialized.");
  }

  public async loadMap(mapData: GeneratedMapData): Promise<void> {
    console.log(`ProceduralMapLoader: Loading map ID ${mapData.mapId} (Theme: ${mapData.theme}, Size: ${mapData.size.width}x${mapData.size.height})`);
    
    // 1. Clear previous map data/entities if any
    // this.gameClient.entityManager?.clearAllEntities(); // Hypothetical method on an entity manager
    // this.gameClient.mapManager?.clearCurrentMap(); // Hypothetical method on map manager

    // 2. Process and set up tile data for rendering
    // This is where you'd pass mapData.tiles and tileset information to a MapManager or a TilemapRenderer instance.
    // Example:
    // const mapManager = this.gameClient.getSystem('MapManager'); // Get the MapManager system
    // if (mapManager) {
    //    mapManager.loadFromProceduralData(mapData); // A new method to handle GeneratedMapData
    // } else {
    //    console.error("MapManager system not found in ProceduralMapLoader.");
    // }
    
    // If using a dedicated tilemap renderer:
    // await this.tilemapRenderer.prepareTilesets(mapData.tilesets); // Assuming tileset info is part of GeneratedMapData
    // this.tilemapRenderer.setCurrentTileData(mapData.tiles, mapData.size.width, mapData.size.height);
    
    console.log("ProceduralMapLoader: Tile data processed (simulated). For actual rendering, integrate with MapManager/TilemapRenderer.");

    // 3. Spawn entities defined in mapData.entities
    if (mapData.entities && mapData.entities.length > 0) {
      console.log(`Spawning ${mapData.entities.length} entities...`);
      for (const entityData of mapData.entities) {
        // Example: Convert grid coords to world coords if necessary
        // const worldX = entityData.x * TILE_WIDTH;
        // const worldY = entityData.y * TILE_HEIGHT;
        // this.gameClient.entityManager.spawnEntity(entityData.type, worldX, worldY, entityData.properties);
        console.log(`  - Spawning entity type '${entityData.type}' at grid (x:${entityData.x}, y:${entityData.y}) with properties: ${JSON.stringify(entityData.properties || {})} (simulated).`);
      }
    }

    // 4. Set player start position
    if (mapData.entryPoints && mapData.entryPoints.length > 0) {
      const entryPoint = mapData.entryPoints[0]; // Use the first entry point
      // const playerWorldX = entryPoint.x * TILE_WIDTH + TILE_WIDTH / 2; // Center of tile
      // const playerWorldY = entryPoint.y * TILE_HEIGHT + TILE_HEIGHT / 2;
      // this.gameClient.getPlayer()?.setPosition(playerWorldX, playerWorldY);
      console.log(`ProceduralMapLoader: Player start position set to grid (x:${entryPoint.x}, y:${entryPoint.y}), name: '${entryPoint.name || 'default'}' (simulated).`);
    } else {
        console.warn("ProceduralMapLoader: No entry points defined in map data. Player position not set.");
    }

    // 5. Apply any map-specific settings or trigger initial map events
    if (mapData.mapNotes) {
        console.log("Map Notes from AI:", mapData.mapNotes);
        // this.gameClient.uiManager?.showNotification("Map Insight", mapData.mapNotes, 10000); // Show for 10s
    }
    
    console.log(`ProceduralMapLoader: Map ${mapData.mapId} setup complete.`);
  }

  // This method would be called by the GameLoop if this loader also handles rendering.
  // More likely, this class hands off data to MapManager or TilemapRenderer.
  public render(renderer: CanvasRenderingContext2D | any): void {
    // if (this.tilemapRenderer && this.tilemapRenderer.hasMapData()) {
    //   this.tilemapRenderer.renderActiveLayers(renderer, this.gameClient.camera.x, this.gameClient.camera.y);
    // } else {
    //    // Fallback or simple rendering if not using TilemapRenderer
    //    // console.log("ProceduralMapLoader: Render call (no actual rendering implemented for this loader itself).");
    // }
  }
}

console.log("ProceduralMapLoader class (src/game-client/world/ProceduralMapLoader.ts) loaded and typed.");
