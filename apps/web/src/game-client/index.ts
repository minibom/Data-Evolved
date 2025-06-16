// src/game-client/index.ts
import { GameLoop } from './core/GameLoop';
import { AssetManager } from './core/AssetManager';
import { InputManager } from './core/InputManager';
import { ApiClient } from './api-client';
import { MapManager } from './world/MapManager';
import { ProceduralMapLoader } from './world/ProceduralMapLoader';
import type { BaseScene } from './scenes/BaseScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GamePlayScene } from './scenes/GamePlayScene'; // Example scene

// Systems - import all as needed
import { CombatSystem } from './systems/CombatSystem';
import { InventorySystem } from './systems/InventorySystem';
import { QuestSystem } from './systems/QuestSystem';
import { RealtimeSyncSystem } from './systems/RealtimeSyncSystem';
import { PathfindingSystem } from './systems/PathfindingSystem';
import { ShopSystem } from './systems/ShopSystem';
import { CraftingSystem } from './systems/CraftingSystem';
import { ZoneControlSystem } from './systems/ZoneControlSystem';
import { PvpSystem } from './systems/PvpSystem';
import { ProtocolForkSystem } from './systems/ProtocolForkSystem';
import { SourceCodeAnomalySystem } from './systems/SourceCodeAnomalySystem';
import { MapGenerationSystem } from './systems/MapGenerationSystem';
import { NpcInteractionSystem } from './systems/NpcInteractionSystem';
import { IntelDisseminationSystem } from './systems/IntelDisseminationSystem';
// ... import other systems

// UI - import all as needed
// import { HealthBar } from './ui/HealthBar';
// ... import other UI elements

export class GameClient {
  public canvas: HTMLCanvasElement;
  public gameLoop: GameLoop;
  public assetManager: AssetManager;
  public inputManager: InputManager;
  public apiClient: ApiClient;
  public mapManager: MapManager;
  public proceduralMapLoader: ProceduralMapLoader;

  private systems: Map<string, any> = new Map();
  public currentScene: BaseScene | null = null; // Made public for scene access if needed

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    console.log("GameClient initializing with canvas:", canvas);

    this.assetManager = new AssetManager();
    this.inputManager = new InputManager(this.canvas); // Pass canvas to input manager
    this.gameLoop = new GameLoop(this.update.bind(this), this.render.bind(this));
    this.apiClient = new ApiClient(this); // Pass GameClient instance
    this.mapManager = new MapManager(this); // Pass GameClient instance
    this.proceduralMapLoader = new ProceduralMapLoader(this); // Pass GameClient instance

    this.registerSystems();

    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'hsl(var(--secondary))';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = 'hsl(var(--secondary-foreground))';
      ctx.font = '20px Space Grotesk';
      ctx.textAlign = 'center';
      ctx.fillText('GameClient Initialized - Ready for Systems', this.canvas.width / 2, this.canvas.height / 2);
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
    // ... register other systems as they are created
    console.log("Game systems registered.");
  }

  public init(): void {
    console.log("GameClient: Initializing core components and systems...");
    this.inputManager.init();
    this.systems.forEach(system => system.init());
    this.loadScene(new MainMenuScene(this));
  }

  public async startGameLoop(): Promise<void> {
    console.log("GameClient: Starting main loop.");
    // Example: Load common assets or assets for the initial scene
    // await this.assetManager.loadAssets({ /* manifest */ });
    this.gameLoop.start();
  }
  
  public stopGameLoop(): void {
    this.gameLoop.stop();
  }

  public loadScene(scene: BaseScene): void {
    if (this.currentScene) {
      this.currentScene.destroy();
    }
    this.currentScene = scene;
    this.currentScene.init(); // This should handle preload and create internally
    console.log(`GameClient: Scene loaded - ${scene.constructor.name}`);
  }

  private update(deltaTime: number): void { // deltaTime is in milliseconds for GameLoop
    this.inputManager.update(); // Update input states first
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
    this.systems.forEach(system => system.update(deltaTime));
  }

  private render(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.currentScene) {
      this.currentScene.render(ctx);
    }
    // Systems might also render debug info or overlays
    // this.systems.forEach(system => { if (typeof system.render === 'function') system.render(ctx); });
  }

  public getSystem<T extends new (...args: any[]) => any>(SystemClass: T): InstanceType<T> {
    const system = this.systems.get(SystemClass.name);
    if (!system) {
      throw new Error(`System ${SystemClass.name} not registered.`);
    }
    return system as InstanceType<T>;
  }

  public getAssetManager(): AssetManager {
    return this.assetManager;
  }

  public getApiClient(): ApiClient {
    return this.apiClient;
  }

  public getInputManager(): InputManager {
    return this.inputManager;
  }
  
  public getMapManager(): MapManager {
    return this.mapManager;
  }

  public getProceduralMapLoader(): ProceduralMapLoader {
    return this.proceduralMapLoader;
  }
}

// This function would be called from the React component (e.g., src/app/game/page.tsx)
export function initializeGame(canvasElement: HTMLCanvasElement): GameClient {
  const gameClientInstance = new GameClient(canvasElement);
  gameClientInstance.init();
  // Start game loop might be triggered by a UI button or after initial assets load
  // For now, let's assume it can be started manually if needed, or via MainMenuScene
  // gameClientInstance.startGameLoop(); 
  return gameClientInstance;
}

console.log("Game Client main script (src/game-client/index.ts) updated.");
