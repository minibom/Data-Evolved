// src/game-client/world/TilemapRenderer.ts
// A dedicated class for rendering tilemaps, potentially using a specific graphics library (e.g., PixiJS tilemap plugin)
// or optimized canvas drawing. This would be more advanced than basic rendering in MapManager.

// import type { GameClient } from '../index';
// import type { Tileset, TileLayer } from '@packages/common-types/game'; // Assuming Tiled JSON structure types

export class TilemapRenderer {
  // private gameClient: GameClient;
  private tilesetImages: Map<string, HTMLImageElement> = new Map(); // Tileset name -> Image

  constructor(/* gameClient: GameClient */) {
    // this.gameClient = gameClient;
    console.log("TilemapRenderer initialized. (Advanced rendering logic to be implemented)");
  }

  public async loadTileset(tilesetName: string, imageUrl: string): Promise<void> {
    // const assetManager = this.gameClient.getAssetManager();
    // const image = await assetManager.loadImage(tilesetName, imageUrl);
    // this.tilesetImages.set(tilesetName, image);
    console.log(`Tileset "${tilesetName}" image loaded (placeholder).`);
  }

  public renderLayer(
    renderer: CanvasRenderingContext2D | any, // Could be WebGL context or PixiJS container
    layerData: any, // TileLayer data from Tiled JSON
    tilesetDefinitions: any[] // Array of Tileset definitions from Tiled JSON
    // cameraX: number, cameraY: number // For viewport culling
  ): void {
    if (!layerData.visible || !layerData.data) return;

    const { width: layerWidthInTiles, tilewidth, tileheight } = layerData; // Tiled provides these
    // const startCol = Math.floor(cameraX / tilewidth);
    // const endCol = Math.min(layerWidthInTiles, Math.ceil((cameraX + renderer.canvas.width) / tilewidth));
    // const startRow = Math.floor(cameraY / tileheight);
    // const endRow = Math.min(layerData.height, Math.ceil((cameraY + renderer.canvas.height) / tileheight));


    for (let r = 0; /*startRow*/ r < layerData.height /*endRow*/; r++) {
      for (let c = 0; /*startCol*/ c < layerWidthInTiles /*endCol*/; c++) {
        const tileIndex = r * layerWidthInTiles + c;
        const gid = layerData.data[tileIndex];

        if (gid === 0) continue; // 0 means empty tile

        // Find which tileset this GID belongs to and its local ID within that tileset
        let currentTileset = null;
        let localId = gid;
        for (let i = tilesetDefinitions.length - 1; i >= 0; i--) {
          if (gid >= tilesetDefinitions[i].firstgid) {
            currentTileset = tilesetDefinitions[i];
            localId = gid - tilesetDefinitions[i].firstgid;
            break;
          }
        }

        if (!currentTileset) continue;

        const tilesetImage = this.tilesetImages.get(currentTileset.name);
        if (!tilesetImage) {
            // console.warn(`Tileset image for ${currentTileset.name} not loaded for GID ${gid}`);
            continue;
        }
        
        const tsTileWidth = currentTileset.tilewidth || tilewidth;
        const tsTileHeight = currentTileset.tileheight || tileheight;
        const columnsInTileset = Math.floor(tilesetImage.width / tsTileWidth);

        const sourceX = (localId % columnsInTileset) * tsTileWidth;
        const sourceY = Math.floor(localId / columnsInTileset) * tsTileHeight;

        const destX = c * tilewidth; // - cameraX;
        const destY = r * tileheight; // - cameraY;

        renderer.drawImage(
          tilesetImage,
          sourceX, sourceY, tsTileWidth, tsTileHeight, // Source rect in tileset image
          destX, destY, tilewidth, tileheight // Destination rect on canvas
        );
      }
    }
  }
}

console.log("TilemapRenderer class (src/game-client/world/TilemapRenderer.ts) loaded.");
