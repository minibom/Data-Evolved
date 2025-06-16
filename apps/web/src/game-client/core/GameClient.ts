// src/game-client/core/GameClient.ts
/**
 * GameClient is the main orchestrator for the game client-side.
 * It initializes and manages core components like the game loop,
 * asset manager, input manager, API client, scenes, and game systems.
 * It provides a central point of access to these components for other parts of the game.
 */
import { GameLoop } from './GameLoop';
import { AssetManager } //, type AssetManifest 
    from './AssetManager';
import { InputManager } from './InputManager';
import { EventManager } from './EventManager';
import { ApiClient } from '../api-client';
import { MapManager } from '../world/MapManager';
import { ProceduralMapLoader } from '../world/ProceduralMapLoader';
import { ZoneManager } from '../world/ZoneManager';
import type { BaseScene } from '../scenes/BaseScene';
import { MainMenuScene } from '../scenes/MainMenuScene';
// import { GamePlayScene } from '../scenes/GamePlayScene'; // Example scene

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
// ... import other systems

// UI Elements that might be managed or accessed via GameClient
// import { HealthBar } from '../ui/HealthBar';
// import { DialogueRenderer } from '../ui/DialogueRenderer'; // Canvas based
// import { GameMessageOverlay } from '../ui/GameMessageOverlay';
// import { GhzMeter } from '../ui/GhzMeter';


export class GameClient {
  public canvas: HTMLCanvasElement;
  public gameLoop: GameLoop;
  public assetManager: AssetManager;
  public inputManager: InputManager;
  public eventManager: EventManager;
  public apiClient: ApiClient;
  public mapManager: MapManager;
  public proceduralMapLoader: ProceduralMapLoader;
  public zoneManager: ZoneManager; // Manages zone data and transitions

  private systems: Map<string, BaseSystem> = new Map(); // Stores instances of game systems
  public currentScene: BaseScene | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    console.log("GameClient initializing with canvas:", canvas);

    // Initialize core managers
    this.assetManager = new AssetManager();
    this.inputManager = new InputManager(this.canvas); // Input manager needs a target
    this.eventManager = new EventManager();
    this.apiClient = new ApiClient(this); // Pass GameClient instance for potential shared access

    // Initialize world and map related managers
    this.mapManager = new MapManager(this);
    this.proceduralMapLoader = new ProceduralMapLoader(this);
    this.zoneManager = new ZoneManager(this);

    // Initialize the game loop with update and render methods of this GameClient
    this.gameLoop = new GameLoop(this.update.bind(this), this.render.bind(this));

    this.registerSystems();

    // Initial canvas setup (placeholder)
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'hsl(var(--secondary))';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = 'hsl(var(--secondary-foreground))';
      ctx.font = '20px Space Grotesk';
      ctx.textAlign = 'center';
      ctx.fillText('GameClient Initialized - Systems Registered', this.canvas.width / 2, this.canvas.height / 2);
    }
  }

  /**
   * Registers all game systems.
   * Systems are responsible for specific game logic domains (combat, quests, etc.).
   */
  private registerSystems(): void {
    // Instantiate and store each system
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

  /**
   * Initializes core components and the first scene.
   * Called after GameClient construction.
   */
  public init(): void {
    console.log("GameClient: Initializing core components, systems, and loading initial scene...");
    this.inputManager.init(); // Setup event listeners
    
    // Initialize all registered systems
    this.systems.forEach(system => system.init());
    
    // Load initial assets (e.g., for main menu or common UI)
    // await this.assetManager.loadAssets({ /* common assets manifest */ });

    // Load the initial scene (e.g., MainMenuScene)
    this.loadScene(new MainMenuScene(this)); // MainMenuScene should handle its own asset preloading
  }

  /**
   * Starts the main game loop.
   * Should be called after `init()` and potentially after initial assets are loaded.
   */
  public async startGameLoop(): Promise<void> {
    console.log("GameClient: Starting main game loop.");
    this.gameLoop.start();
  }

  /**
   * Stops the main game loop.
   */
  public stopGameLoop(): void {
    this.gameLoop.stop();
    console.log("GameClient: Game loop stopped.");
  }

  /**
   * Loads and transitions to a new scene.
   * @param scene The scene instance to load.
   */
  public loadScene(scene: BaseScene): void {
    if (this.currentScene) {
      this.currentScene.destroy(); // Clean up the old scene
    }
    this.currentScene = scene;
    this.currentScene.init(); // Initialize the new scene (which should handle its preloading and creation)
    console.log(`GameClient: Scene loaded - ${scene.constructor.name}`);
  }

  /**
   * Main update method called by the GameLoop.
   * @param deltaTime Time elapsed since the last update, in milliseconds.
   */
  private update(deltaTime: number): void {
    this.inputManager.update(); // Update input states first

    // Update the current scene
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }

    // Update all registered game systems
    this.systems.forEach(system => system.update(deltaTime));
  }

  /**
   * Main render method called by the GameLoop.
   */
  private render(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas (or the main viewport of the rendering engine)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Example: Fill background if needed, though scenes might handle this
    // ctx.fillStyle = "hsl(var(--background))";
    // ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


    // Render the current scene
    if (this.currentScene) {
      this.currentScene.render(ctx); // Pass the rendering context
    }

    // Systems might also render debug info or overlays (optional)
    // this.systems.forEach(system => {
    //   if (typeof (system as any).render === 'function') {
    //     (system as any).render(ctx);
    //   }
    // });
  }

  /**
   * Retrieves a registered game system instance.
   * @param SystemClass The class of the system to retrieve.
   * @returns The instance of the system.
   * @throws Error if the system is not registered.
   */
  public getSystem<T extends BaseSystem>(SystemClass: new (...args: any[]) => T): T {
    const system = this.systems.get(SystemClass.name) as T;
    if (!system) {
      throw new Error(`System ${SystemClass.name} not registered or found.`);
    }
    return system;
  }

  // Getters for core managers
  public getAssetManager(): AssetManager { return this.assetManager; }
  public getInputManager(): InputManager { return this.inputManager; }
  public getEventManager(): EventManager { return this.eventManager; }
  public getApiClient(): ApiClient { return this.apiClient; }
  public getMapManager(): MapManager { return this.mapManager; }
  public getProceduralMapLoader(): ProceduralMapLoader { return this.proceduralMapLoader; }
  public getZoneManager(): ZoneManager { return this.zoneManager; }
  public getCanvas(): HTMLCanvasElement { return this.canvas; }
}

// This function would be called from the React component (e.g., src/app/game/page.tsx)
// to create and initialize the game instance.
export function initializeGame(canvasElement: HTMLCanvasElement): GameClient {
  const gameClientInstance = new GameClient(canvasElement);
  gameClientInstance.init(); // Initialize systems and load initial scene
  // The game loop might be started by a UI element (e.g., "Start Game" button in MainMenuScene)
  // or automatically if transitioning directly to gameplay.
  // gameClientInstance.startGameLoop();
  return gameClientInstance;
}

console.log("GameClient class (src/game-client/core/GameClient.ts) loaded and updated.");
