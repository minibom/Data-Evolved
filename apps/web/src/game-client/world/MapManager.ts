// src/game-client/world/MapManager.ts
import type { GameClient } from '../core/GameClient'; // Adjusted path
import type { GeneratedMapData, Tile as CommonTile } from '@packages/common-types/map';
import type { TileMap, Tile, MapLayer } from './'; // Local client-side types/interfaces


export class MapManager {
  protected game: GameClient;
  public currentMap: TileMap | null = null; // Client-side internal representation
  private currentMapDataSource: GeneratedMapData | null = null; // Raw data from generation

  constructor(game: GameClient) {
    this.game = game;
    console.log("MapManager initialized.");
  }

  public async loadMap(mapDataSource: GeneratedMapData | string): Promise<void> {
    console.log("MapManager: Loading map...", typeof mapDataSource === 'string' ? mapDataSource : mapDataSource.mapId);
    if (typeof mapDataSource === 'string') {
      if (mapDataSource === 'default_mock_map') {
        // Create a very simple mock map
        const mockWidth = 25;
        const mockHeight = 20;
        const mockTiles: CommonTile[][] = Array(mockHeight).fill(null).map((_, y) => 
          Array(mockWidth).fill(null).map((_, x) => ({
            type: (x === 0 || x === mockWidth - 1 || y === 0 || y === mockHeight - 1) ? 'wall_debug' : 'floor_debug',
            isWalkable: !(x === 0 || x === mockWidth - 1 || y === 0 || y === mockHeight - 1),
            isTransparent: true,
          }))
        );
        this.currentMapDataSource = {
          mapId: 'default_mock_map',
          size: { width: mockWidth, height: mockHeight },
          theme: "debug",
          tiles: mockTiles,
          entryPoints: [{ x: Math.floor(mockWidth / 2), y: Math.floor(mockHeight / 2), name: "start" }],
          version: "1.0"
        };
      } else {
        // Try to load by ID/Path via API/AssetManager (placeholder)
        console.warn(`MapManager: Actual loading for map ID/Path '${mapDataSource}' not fully implemented. Using fallback or error.`);
        // this.currentMapDataSource = await this.game.getAssetManager().getTilemap(mapDataSource); // Or API call
        return; // Or throw error
      }
    } else {
      this.currentMapDataSource = mapDataSource;
    }

    if (this.currentMapDataSource) {
      this.parseAndSetCurrentMap(this.currentMapDataSource);
      console.log(`MapManager: Map "${this.currentMapDataSource.mapId}" loaded and parsed.`);
    } else {
      console.error("MapManager: Failed to load map data.");
    }
  }
  
  private parseAndSetCurrentMap(mapData: GeneratedMapData): void {
    console.log("MapManager: Parsing raw map data into internal TileMap structure.", mapData.mapId);
    
    // Assuming standard tile dimensions for now
    const tilePixelWidth = 32;
    const tilePixelHeight = 32;

    // Create main tile layer from mapData.tiles
    const baseTileLayer: MapLayer = {
        name: "BaseLayer",
        type: "tilelayer",
        tiles: mapData.tiles.map(row => row.map(commonTile => ({
            type: commonTile.type,
            isWalkable: commonTile.isWalkable,
            isTransparent: commonTile.isTransparent,
            properties: commonTile.properties,
            // textureName could be derived from commonTile.type here
        } as Tile))), // Cast to client-side Tile
        visible: true,
        opacity: 1,
    };

    this.currentMap = {
        mapId: mapData.mapId,
        theme: mapData.theme,
        width: mapData.size.width,
        height: mapData.size.height,
        tileWidth: tilePixelWidth, 
        tileHeight: tilePixelHeight,
        tiles: baseTileLayer.tiles!, // Using the parsed tiles for the main display
        layers: [baseTileLayer], // Add other layers if mapData supports them (e.g., object layers)
        entryPoints: mapData.entryPoints,
    };
    // TODO: Process mapData.entities and mapData.zones into other layers or systems if needed
  }

  public getTileAtWorld(worldX: number, worldY: number): Tile | null {
    if (!this.currentMap) return null;
    const gridX = Math.floor(worldX / this.currentMap.tileWidth);
    const gridY = Math.floor(worldY / this.currentMap.tileHeight);
    if (gridX >= 0 && gridX < this.currentMap.width && gridY >= 0 && gridY < this.currentMap.height) {
      return this.currentMap.tiles[gridY]?.[gridX] || null;
    }
    return null;
  }
  
  public isWalkableAtWorld(worldX: number, worldY: number): boolean {
      const tile = this.getTileAtWorld(worldX, worldY);
      return tile?.isWalkable || false;
  }

  public update(deltaTime: number): void {
    // Update animated tiles or other map-specific dynamic elements
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.currentMap || !this.currentMap.tiles) {
        renderer.fillStyle = 'hsl(var(--muted))'; // Use a theme color
        renderer.fillRect(0,0, renderer.canvas.width, renderer.canvas.height);
        renderer.fillStyle = 'hsl(var(--muted-foreground))';
        renderer.textAlign = 'center';
        renderer.font = '16px Space Grotesk';
        renderer.fillText("Map data not available.", renderer.canvas.width/2, renderer.canvas.height/2);
        renderer.textAlign = 'left'; // Reset
        return;
    }
    
    const { tiles, width, height, tileWidth, tileHeight } = this.currentMap;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const tile = tiles[y]?.[x];
            if (tile) {
                renderer.fillStyle = tile.type === 'wall_debug' ? 'hsl(var(--secondary-foreground))' : 
                                     tile.isWalkable ? 'hsl(var(--secondary))' : 'hsl(var(--muted))';
                renderer.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                renderer.strokeStyle = 'hsl(var(--border))';
                renderer.strokeRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
        }
    }
    // Render entry points for debugging
    this.currentMap.entryPoints?.forEach(ep => {
        renderer.fillStyle = 'green';
        renderer.beginPath();
        renderer.arc(ep.x * tileWidth + tileWidth/2, ep.y * tileHeight + tileHeight/2, tileWidth/4, 0, Math.PI*2);
        renderer.fill();
    });
  }
}
