// src/game-client/scenes/GamePlayScene.ts
import { BaseScene } from './BaseScene';
import type { GameClient } from '../core/GameClient'; // Adjusted path
import { Player } from '../entities/Player';
import type { Entity } from '../entities/Entity';
import { MapManager } from '../world/MapManager';
import { ZoneControlSystem } from '../systems/ZoneControlSystem';
import type { PlayerData } from '@packages/common-types/game'; // For PlayerData

export class GamePlayScene extends BaseScene {
  public player: Player | null = null;
  public entities: Entity[] = [];
  public mapManager: MapManager;
  // public zoneManager: ZoneControlSystem; // ZoneControlSystem is a system, not directly managed by scene in this way

  constructor(game: GameClient) {
    super(game);
    this.mapManager = game.getMapManager();
    // this.zoneManager = game.getSystem(ZoneControlSystem); // Get system if needed
    console.log("GamePlayScene constructed.");
  }

  protected async preload(): Promise<void> {
    await super.preload(); // Call base class preload
    console.log("GamePlayScene preloading assets...");
    // For now, we'll load a mock map directly in create or have MapManager handle it.
    // No explicit asset loading here for this basic version.
    await this.mapManager.loadMap('default_mock_map');
    console.log("GamePlayScene assets preloaded (mock map loaded).");
  }

  protected create(): void {
    super.create(); // Call base class create
    console.log("GamePlayScene creating objects...");

    // Initial player data (can be loaded from API later)
    const initialPlayerData: PlayerData = {
      id: 'player_1',
      name: "Player One",
      currentGHZ: 1,
      level: 1,
      xp: 0,
      stats: { power: 100, memory: 50, firewall: 5, ghz: 10 },
      inventory: [],
      activeQuests: [],
      completedQuests: [],
      currency: { dataShards: 0 },
      // factionId will be undefined initially
    };

    this.player = new Player(this.game, this.game.canvas.width / 2, this.game.canvas.height / 2, initialPlayerData);
    this.entities.push(this.player);

    // Example: Add a simple enemy or NPC if desired for testing
    // const enemy = new EnemyAI(this.game, 300, 300, { name: "Test Drone", initialStats: {speed: 50}});
    // this.entities.push(enemy);
  }

  public update(delta: number): void { // delta is deltaTime in ms
    if (!this.isActive) return;

    const inputManager = this.game.getInputManager();
    
    // Update all entities
    for (const entity of this.entities) {
      if (entity === this.player) {
        this.player.update(delta, inputManager); // Player update needs input manager
      } else {
        entity.update(delta); // Other entities might have AI or simpler updates
      }
    }
    
    this.mapManager.update(delta); // Update map (e.g., animated tiles)

    // Example of simple boundary check for the player
    if (this.player) {
        this.player.x = Math.max(0, Math.min(this.player.x, this.game.canvas.width - this.player.width));
        this.player.y = Math.max(0, Math.min(this.player.y, this.game.canvas.height - this.player.height));
    }
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isActive) return;
    
    // MapManager renders first (background)
    this.mapManager.render(renderer);
    
    // Render all entities
    // Sort entities by Y for pseudo-2.5D depth if needed, or use z-index
    // const sortedEntities = [...this.entities].sort((a, b) => a.y - b.y);
    for (const entity of this.entities) {
      entity.render(renderer);
    }

    // Render UI elements on top (HealthBar, GhzMeter, etc.)
    // Example: this.game.uiManager.render(renderer);
  }

  public destroy(): void {
    super.destroy();
    this.entities = [];
    this.player = null;
    console.log("GamePlayScene specific resources cleaned up.");
  }
}
