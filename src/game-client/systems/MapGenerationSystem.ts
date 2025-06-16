// src/game-client/systems/MapGenerationSystem.ts
// Manages requests for AI-generated maps and handles loading them into the game client.

// import type { GameClient } from '../index';
import { generateNewMap, loadGeneratedMapData } from '../api-client/map';
import type { MapGenerationParams, GeneratedMapData } from '@packages/common-types/map';
// import type { ProceduralMapLoader } from '../world/ProceduralMapLoader'; // To hand off map data

export class MapGenerationSystem {
  private gameClient: any; // GameClient instance
  private isLoadingMap: boolean = false;
  private currentGeneratedMap: GeneratedMapData | null = null;

  constructor(gameClient: any /* GameClient */) {
    this.gameClient = gameClient;
    console.log("MapGenerationSystem initialized.");
  }

  public async requestAndLoadNewMap(params: MapGenerationParams): Promise<boolean> {
    if (this.isLoadingMap) {
      console.warn("Map generation already in progress.");
      return false;
    }
    this.isLoadingMap = true;
    // this.gameClient.uiManager.showLoadingScreen("Generating new realm..."); // Placeholder for UI update

    try {
      console.log("MapGenerationSystem: Requesting new map from server with params:", params);
      const response = await generateNewMap(params);
      this.currentGeneratedMap = response.mapData;
      
      console.log(`MapGenerationSystem: New map ${response.mapId} received. Triggering load...`);
      
      // const mapLoader = this.gameClient.getSystem('ProceduralMapLoader') as ProceduralMapLoader; // Assuming system registry
      // if (mapLoader) {
      //   await mapLoader.loadMap(this.currentGeneratedMap);
      //   // this.gameClient.uiManager.hideLoadingScreen();
      //   // this.gameClient.transitionToScene('ProceduralGameScene', { mapData: this.currentGeneratedMap });
      //   console.log("MapGenerationSystem: Map loaded and rendered by ProceduralMapLoader.");
      //   return true;
      // } else {
      //   console.error("ProceduralMapLoader system not found.");
      //   return false;
      // }
      
      // Simulate loading map into the game client world
      console.log("SIMULATING: ProceduralMapLoader is processing map:", this.currentGeneratedMap.mapId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      console.log("SIMULATING: Map loaded into game world.");
      // this.gameClient.uiManager.hideLoadingScreen(); // Placeholder
      return true;

    } catch (error) {
      console.error("Failed to request or load new map:", error);
      // this.gameClient.uiManager.showError("Failed to generate realm. Please try again.");
      // this.gameClient.uiManager.hideLoadingScreen();
      return false;
    } finally {
      this.isLoadingMap = false;
    }
  }

  public async loadExistingMap(mapId: string): Promise<boolean> {
    if (this.isLoadingMap) {
      console.warn("Map loading already in progress.");
      return false;
    }
    this.isLoadingMap = true;
    // this.gameClient.uiManager.showLoadingScreen(`Loading realm ${mapId}...`);

    try {
      const mapData = await loadGeneratedMapData(mapId);
      if (mapData) {
        this.currentGeneratedMap = mapData;
        // Similar loading logic as above with ProceduralMapLoader
        console.log(`MapGenerationSystem: Existing map ${mapId} data received. Triggering load...`);
        console.log("SIMULATING: ProceduralMapLoader is processing map:", this.currentGeneratedMap.mapId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("SIMULATING: Map loaded into game world.");
        // this.gameClient.uiManager.hideLoadingScreen();
        return true;
      } else {
        // this.gameClient.uiManager.showError(`Failed to load realm ${mapId}.`);
        console.error(`Failed to load existing map ${mapId}. Data not found.`);
        return false;
      }
    } catch (error) {
      console.error(`Error loading existing map ${mapId}:`, error);
      // this.gameClient.uiManager.showError("Failed to load realm.");
      return false;
    } finally {
      this.isLoadingMap = false;
      // this.gameClient.uiManager.hideLoadingScreen();
    }
  }

  public getCurrentGeneratedMap(): GeneratedMapData | null {
    return this.currentGeneratedMap;
  }
}

console.log("MapGenerationSystem class (src/game-client/systems/MapGenerationSystem.ts) loaded.");
