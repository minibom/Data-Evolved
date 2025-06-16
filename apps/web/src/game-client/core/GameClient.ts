// src/game-client/core/GameClient.ts
/**
 * GameClient is the main orchestrator for the game client-side.
 * It initializes and manages core components like the game loop,
 * asset manager, input manager, API client, scenes, and game systems.
 * It provides a central point of access to these components for other parts of the game.
 */
import { GameLoop } from './GameLoop';
import { AssetManager } from './AssetManager';
import { InputManager } from './InputManager';
import { EventManager } from './EventManager';
import { ApiClient } from '../api-client';
import { MapManager } from '../world/MapManager';
import { ProceduralMapLoader } from '../world/ProceduralMapLoader';
import { ZoneManager } from '../world/ZoneManager';
import type { BaseScene } from '../scenes/BaseScene';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { GamePlayScene } from '../scenes/GamePlayScene';

// Import all systems
import { BaseSystem } from '../systems/BaseSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { QuestSystem } from '../systems/QuestSystem';
import { RealtimeSyncSystem } from '../systems/RealtimeSyncSystem';
import { PathfindingSystem } from '../systems/PathfindingSystem';
import { ShopSystem } from '../systems/ShopSystem';
import { CraftingSystem } from '../systems/CraftingSystem';
import { ZoneControlSystem } from '../systems/ZoneControlSystem';
import { PvpSystem } from '../systems/PvpSystem';
import { ProtocolForkSystem } from '../systems/ProtocolForkSystem';
import { SourceCodeAnomalySystem } from '../systems/SourceCodeAnomalySystem';
import { MapGenerationSystem } from '../systems/MapGenerationSystem';
import { NpcInteractionSystem } from '../systems/NpcInteractionSystem';
import { IntelDisseminationSystem } from '../systems/IntelDisseminationSystem';
import { LootSystem } from '../systems/LootSystem';
import { FactionSystem } from '../systems/FactionSystem';
import { GuildSystem } from '../systems/GuildSystem';
import { AchievementSystem } from '../systems/AchievementSystem';
import { BossRaidSystem } from '../systems/BossRaidSystem';


export class GameClient {
  public canvas: HTMLCanvasElement;
  public gameLoop: GameLoop;
  public assetManager: AssetManager;
  public inputManager: InputManager;
  public eventManager: EventManager;
  public apiClient: ApiClient;
  public mapManager: MapManager;
  public proceduralMapLoader: ProceduralMapLoader;
  public zoneManager: ZoneManager;

  private systems: Map<string, BaseSystem> = new Map();
  public currentScene: BaseScene | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    console.log("GameClient initializing with canvas:", canvas);

    this.assetManager = new AssetManager();
    this.inputManager = new InputManager(this.canvas);
    this.eventManager = new EventManager();
    this.apiClient = new ApiClient(this);
    this.mapManager = new MapManager(this);
    this.proceduralMapLoader = new ProceduralMapLoader(this);
    this.zoneManager = new ZoneManager(this);
    this.gameLoop = new GameLoop(this.update.bind(this), this.render.bind(this));

    this.registerSystems();

    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'hsl(var(--background))'; // Use theme background
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = 'hsl(var(--foreground))'; // Use theme foreground
      ctx.font = '16px Space Grotesk';
      ctx.textAlign = 'center';
      ctx.fillText('GameClient Initialized, Awaiting Scene...', this.canvas.width / 2, this.canvas.height / 2);
    }
  }

  private registerSystems(): void {
    this.systems.set(CombatSystem.name, new CombatSystem(this));
    this.systems.set(InventorySystem.name, new InventorySystem(this));
    this.systems.set(QuestSystem.name, new QuestSystem(this));
    this.systems.set(RealtimeSyncSystem.name, new RealtimeSyncSystem(this));
    this.systems.set(PathfindingSystem.name, new PathfindingSystem(this));
    this.systems.set(ShopSystem.name, new ShopSystem(this));
    this.systems.set(CraftingSystem.name, new CraftingSystem(this));
    this.systems.set(ZoneControlSystem.name, new ZoneControlSystem(this));
    this.systems.set(PvpSystem.name, new PvpSystem(this));
    this.systems.set(ProtocolForkSystem.name, new ProtocolForkSystem(this));
    this.systems.set(SourceCodeAnomalySystem.name, new SourceCodeAnomalySystem(this));
    this.systems.set(MapGenerationSystem.name, new MapGenerationSystem(this));
    this.systems.set(NpcInteractionSystem.name, new NpcInteractionSystem(this));
    this.systems.set(IntelDisseminationSystem.name, new IntelDisseminationSystem(this));
    this.systems.set(LootSystem.name, new LootSystem(this));
    this.systems.set(FactionSystem.name, new FactionSystem(this));
    this.systems.set(GuildSystem.name, new GuildSystem(this));
    this.systems.set(AchievementSystem.name, new AchievementSystem(this));
    this.systems.set(BossRaidSystem.name, new BossRaidSystem(this));
    console.log("All game systems registered with GameClient.");
  }

  public init(): void {
    console.log("GameClient: Initializing core components, systems, and loading initial scene...");
    this.inputManager.init();
    this.systems.forEach(system => system.init());
    // Load GamePlayScene directly for now to get into the action
    this.loadScene(new GamePlayScene(this));
  }

  public startGameLoop(): void {
    console.log("GameClient: Starting main game loop.");
    this.gameLoop.start();
  }

  public stopGameLoop(): void {
    this.gameLoop.stop();
    console.log("GameClient: Game loop stopped.");
  }

  public loadScene(scene: BaseScene): void {
    if (this.currentScene) {
      this.currentScene.destroy();
    }
    this.currentScene = scene;
    // Scene.init() now handles preload and create
    this.currentScene.init();
    console.log(`GameClient: Scene loaded - ${scene.constructor.name}`);
  }

  private update(deltaTime: number): void { // deltaTime is in ms
    this.inputManager.update();
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
    // Systems are updated if they are designed to be updated by the scene or GameClient
    // For now, let's assume scenes manage their relevant systems' updates
  }

  private render(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'hsl(var(--background))'; // Use theme background
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.currentScene) {
      this.currentScene.render(ctx);
    }
  }

  public getSystem<T extends BaseSystem>(SystemClass: new (...args: any[]) => T): T {
    const system = this.systems.get(SystemClass.name) as T;
    if (!system) {
      throw new Error(`System ${SystemClass.name} not registered or found.`);
    }
    return system;
  }

  public getAssetManager(): AssetManager { return this.assetManager; }
  public getInputManager(): InputManager { return this.inputManager; }
  public getEventManager(): EventManager { return this.eventManager; }
  public getApiClient(): ApiClient { return this.apiClient; }
  public getMapManager(): MapManager { return this.mapManager; }
  public getProceduralMapLoader(): ProceduralMapLoader { return this.proceduralMapLoader; }
  public getZoneManager(): ZoneManager { return this.zoneManager; }
  public getCanvas(): HTMLCanvasElement { return this.canvas; }
}
