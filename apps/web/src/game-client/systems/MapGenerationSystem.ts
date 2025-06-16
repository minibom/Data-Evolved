// src/game-client/systems/MapGenerationSystem.ts
import { BaseSystem } from './BaseSystem';
import type { GameClient } from '../index';
import type { MapGenerationParams, GeneratedMapData } from '@packages/common-types/map';

export class MapGenerationSystem extends BaseSystem {
  private isLoadingMap: boolean = false;
  private currentGeneratedMap: GeneratedMapData | null = null;

  constructor(game: GameClient) {
    super(game);
  }

  public init(): void {
    super.init();
  }

  public update(delta: number): void {
    // Potentially handle map loading progress UI updates
  }

  public async requestNewMap(params: MapGenerationParams): Promise<void> {
    if (this.isLoadingMap) {
      console.warn("MapGenerationSystem: Map generation already in progress.");
      // this.game.uiManager.showToast("Map generation in progress...", "info");
      return;
    }
    this.isLoadingMap = true;
    // this.game.uiManager.showLoadingScreen("Generating new realm...");

    try {
      console.log("MapGenerationSystem: Requesting new map from server with params:", params);
      const mapData = await this.game.getApiClient().map.generateNewMap(params);
      this.loadGeneratedMap(mapData);
    } catch (error) {
      console.error("MapGenerationSystem: Failed to request or load new map:", error);
      // this.game.uiManager.showError("Failed to generate realm. Please try again.");
    } finally {
      this.isLoadingMap = false;
      // this.game.uiManager.hideLoadingScreen();
    }
  }

  public loadGeneratedMap(mapData: GeneratedMapData): void {
    this.currentGeneratedMap = mapData;
    console.log(`MapGenerationSystem: New map ${mapData.mapId} received. Triggering load via ProceduralMapLoader...`);
    this.game.getProceduralMapLoader().load(mapData); // Pass to loader
    // Further integration like setting it as current map in world manager or transitioning scene
    // this.game.getWorldManager().setCurrentMap(this.currentGeneratedMap);
    // this.game.sceneManager.transitionToMap(this.currentGeneratedMap.mapId);
  }

  public async loadExistingMapById(mapId: string): Promise<void> {
    if (this.isLoadingMap) {
        console.warn("MapGenerationSystem: Map loading already in progress.");
        return;
    }
    this.isLoadingMap = true;
    // this.game.uiManager.showLoadingScreen(`Loading realm ${mapId}...`);
    try {
        const mapData = await this.game.getApiClient().map.loadMapData(mapId);
        if (mapData) {
            this.loadGeneratedMap(mapData);
        } else {
            console.error(`MapGenerationSystem: Failed to load map data for ${mapId}.`);
            // this.game.uiManager.showError(`Map ${mapId} not found.`);
        }
    } catch (error) {
        console.error(`MapGenerationSystem: Error loading map ${mapId}:`, error);
        // this.game.uiManager.showError("Failed to load realm.");
    } finally {
        this.isLoadingMap = false;
        // this.game.uiManager.hideLoadingScreen();
    }
  }

  public getCurrentGeneratedMap(): GeneratedMapData | null {
    return this.currentGeneratedMap;
  }
}

console.log("MapGenerationSystem class (src/game-client/systems/MapGenerationSystem.ts) updated.");
