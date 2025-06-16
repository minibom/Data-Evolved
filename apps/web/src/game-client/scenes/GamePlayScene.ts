// src/game-client/scenes/GamePlayScene.ts
import { BaseScene } from './BaseScene';
import type { GameClient } from '../index';
import { Player } from '../entities/Player';
import type { Entity } from '../entities/Entity'; // Base type for entities array
import { MapManager } from '../world/MapManager'; // Assuming this is the one to use
import { ZoneControlSystem } from '../systems/ZoneControlSystem'; // For managing zones

export class GamePlayScene extends BaseScene {
  public player: Player | null = null;
  public entities: Entity[] = [];
  public mapManager: MapManager; // Changed from optional to required as per diagram
  public zoneManager: ZoneControlSystem; // Assuming ZoneManager is handled by ZoneControlSystem

  constructor(game: GameClient) {
    super(game);
    this.mapManager = game.getMapManager(); // Get from GameClient
    this.zoneManager = game.getSystem(ZoneControlSystem); // Get from GameClient
    console.log("GamePlayScene constructed.");
  }

  protected async preload(): Promise<void> {
    await super.preload();
    console.log("GamePlayScene preloading assets...");
    // Example:
    // await this.game.getAssetManager().loadAssets({
    //   images: [{ name: 'player_sprite', url: '/assets/player.png' }],
    //   tilemaps: [{ name: 'main_zone_map', url: '/tilemaps/main_zone.json' }]
    // });
    await this.mapManager.loadMap('default_map'); // Load a default map
    console.log("GamePlayScene assets preloaded.");
  }

  protected create(): void {
    super.create();
    console.log("GamePlayScene creating objects...");
    
    this.player = new Player(this.game, 100, 100, { /* player data placeholder */ }); // Example player data
    this.entities.push(this.player);

    // Initialize UI, enemies, quest markers etc.
    // Example: const enemy = new EnemyAI(this.game, 200, 200, {}); this.entities.push(enemy);
  }

  public update(delta: number): void { // delta is deltaTime
    if (!this.isActive) return;

    const inputManager = this.game.getInputManager();
    this.player?.update(delta, inputManager); // Pass input manager to player

    this.entities.forEach(entity => {
      if (entity !== this.player) { // Player already updated
        entity.update(delta); // Other entities might have simpler update or AI driven
      }
    });
    
    this.mapManager.update(delta);
    // this.zoneManager.update(delta); // ZoneControlSystem handles its own updates via GameClient system loop

    // Check for collisions, quest completion, etc.
    // console.log(`GamePlayScene update: ${delta}`); 
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isActive) return;
    
    // Clear canvas (usually done by gameClient or a dedicated renderer)
    // renderer.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);

    this.mapManager.render(renderer);
    
    this.entities.forEach(entity => {
      entity.render(renderer);
    });

    // Render UI elements like health bars, GhzMeter etc.
    // this.game.getSystem(UISystem).render(renderer); // Assuming a UISystem
  }

  public destroy(): void {
    super.destroy();
    this.entities = [];
    this.player = null;
    console.log("GamePlayScene specific resources cleaned up.");
  }
}

console.log("GamePlayScene class (src/game-client/scenes/GamePlayScene.ts) updated.");
