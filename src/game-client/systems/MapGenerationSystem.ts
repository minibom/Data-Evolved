// src/game-client/systems/MapGenerationSystem.ts
// Manages requests for AI-generated maps and handles loading them into the game client.

// import type { GameClient } from '../index'; // Assuming GameClient class
import { generateNewMap, loadGeneratedMapData } from '../api-client/map';
import type { MapGenerationParams, GeneratedMapData } from '@packages/common-types/map';
// import type { ProceduralMapLoader } from '../world/ProceduralMapLoader'; // To hand off map data

export class MapGenerationSystem {
  private gameClient: any; // Placeholder for GameClient instance type
  private isLoadingMap: boolean = false;
  private currentGeneratedMap: GeneratedMapData | null = null;
  // private proceduralMapLoader: ProceduralMapLoader; // Instance of the loader

  constructor(gameClient: any /* GameClient */) {
    this.gameClient = gameClient;
    // this.proceduralMapLoader = new ProceduralMapLoader(gameClient); // Assuming ProceduralMapLoader is available
    console.log("MapGenerationSystem initialized.");
  }

  public async requestAndLoadNewMap(params: MapGenerationParams): Promise<boolean> {
    if (this.isLoadingMap) {
      console.warn("Map generation already in progress.");
      // this.gameClient.uiManager?.showToast("Map generation in progress...", "info");
      return false;
    }
    this.isLoadingMap = true;
    // this.gameClient.uiManager?.showLoadingScreen("Generating new realm...");

    try {
      console.log("MapGenerationSystem: Requesting new map from server with params:", params);
      const response = await generateNewMap(params);
      this.currentGeneratedMap = response.mapData;
      
      console.log(`MapGenerationSystem: New map ${response.mapId} received. Triggering load...`);
      
      // await this.proceduralMapLoader.loadMap(this.currentGeneratedMap);
      // this.gameClient.uiManager?.hideLoadingScreen();
      // this.gameClient.worldManager?.setCurrentMap(this.currentGeneratedMap); // Example integration
      // this.gameClient.sceneManager?.transitionToMap(this.currentGeneratedMap.mapId); // Example
      console.log("SIMULATE: Map loaded into client via ProceduralMapLoader.");
      return true;

    } catch (error) {
      console.error("Failed to request or load new map:", error);
      // this.gameClient.uiManager?.showError("Failed to generate realm. Please try again.");
      // this.gameClient.uiManager?.hideLoadingScreen();
      return false;
    } finally {
      this.isLoadingMap = false;
    }
  }

  public async loadExistingMap(mapId: string): Promise<boolean> {
    if (this.isLoadingMap) {
      console.warn("Map loading already in progress.");
      // this.gameClient.uiManager?.showToast("Map loading in progress...", "info");
      return false;
    }
    this.isLoadingMap = true;
    // this.gameClient.uiManager?.showLoadingScreen(`Loading realm ${mapId}...`);

    try {
      const mapData = await loadGeneratedMapData(mapId);
      if (mapData) {
        this.currentGeneratedMap = mapData;
        // await this.proceduralMapLoader.loadMap(this.currentGeneratedMap);
        // this.gameClient.uiManager?.hideLoadingScreen();
        // this.gameClient.worldManager?.setCurrentMap(this.currentGeneratedMap);
        console.log(`SIMULATE: Existing map ${mapId} data loaded into client.`);
        return true;
      } else {
        // this.gameClient.uiManager?.showError(`Failed to load realm ${mapId}.`);
        console.error(`Failed to load existing map ${mapId}. Data not found.`);
        return false;
      }
    } catch (error) {
      console.error(`Error loading existing map ${mapId}:`, error);
      // this.gameClient.uiManager?.showError("Failed to load realm.");
      return false;
    } finally {
      this.isLoadingMap = false;
      // this.gameClient.uiManager?.hideLoadingScreen();
    }
  }

  public getCurrentGeneratedMap(): GeneratedMapData | null {
    return this.currentGeneratedMap;
  }
}

console.log("MapGenerationSystem class (src/game-client/systems/MapGenerationSystem.ts) loaded and typed.");
