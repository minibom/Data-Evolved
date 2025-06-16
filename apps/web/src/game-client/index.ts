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
// ... import other systems

// UI - import all as needed
import { HealthBar } from './ui/HealthBar';
// ... import other UI elements

export class GameClient {
  public canvas: HTMLCanvasElement;
  private gameLoop: GameLoop;
  private assetManager: AssetManager;
  private inputManager: InputManager;
  private apiClient: ApiClient;
  private mapManager: MapManager;
  private proceduralMapLoader: ProceduralMapLoader;

  private systems: Map<string, any> = new Map();
  private currentScene: BaseScene | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    console.log("GameClient initializing with canvas:", canvas);

    this.assetManager = new AssetManager();
    this.inputManager = new InputManager(this.canvas);
    this.gameLoop = new GameLoop(this.update.bind(this), this.render.bind(this));
    this.apiClient = new ApiClient(this);
    this.mapManager = new MapManager(this);
    this.proceduralMapLoader = new ProceduralMapLoader(this);

    this.registerSystems();

    // Example: Setup a simple 2D context for now if no engine is integrated
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'hsl(var(--secondary))';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = 'hsl(var(--secondary-foreground))';
      ctx.font = '20px Space Grotesk';
      ctx.textAlign = 'center';
      ctx.fillText('GameClient Initialized - Ready for Engine Integration', this.canvas.width / 2, this.canvas.height / 2);
    }
  }

  private registerSystems(): void {
    // Register all game systems
    this.systems.set(CombatSystem.name, new CombatSystem(this));
    this.systems.set(InventorySystem.name, new InventorySystem(this));
    // ... register other systems
    console.log("Game systems registered.");
  }

  public init(): void {
    console.log("GameClient: Initializing core components and systems...");
    this.inputManager.init(); // If it has an init method
    this.systems.forEach(system => system.init());
    // Load initial assets or scene
    this.loadScene(new MainMenuScene(this)); // Start with MainMenuScene
  }

  public async startGameLoop(): Promise<void> {
    console.log("GameClient: Starting main loop.");
    await this.assetManager.loadAssets({}); // Load common assets if any
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
    this.currentScene.init(); // This will call preload and create
    console.log(`GameClient: Scene loaded - ${scene.constructor.name}`);
  }

  private update(deltaTime: number): void {
    this.inputManager.update(); // Update input states first
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
    this.systems.forEach(system => system.update(deltaTime));
  }

  private render(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas each frame

    if (this.currentScene) {
      this.currentScene.render(ctx); // Pass canvas context or renderer
    }
    // Systems might also render debug info or overlays
    // this.systems.forEach(system => system.render(ctx)); // If systems have render methods
  }

  public getSystem<T>(SystemClass: new (...args: any[]) => T): T {
    const system = this.systems.get(SystemClass.name);
    if (!system) {
      throw new Error(`System ${SystemClass.name} not registered.`);
    }
    return system as T;
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

export function initializeGame(canvasElement: HTMLCanvasElement): GameClient {
  const gameClientInstance = new GameClient(canvasElement);
  gameClientInstance.init();
  // Start game loop after initial setup
  // gameClientInstance.startGameLoop(); // This might be triggered by a UI button e.g. "Start Game"
  return gameClientInstance;
}

console.log("Game Client main script (src/game-client/index.ts) updated.");
