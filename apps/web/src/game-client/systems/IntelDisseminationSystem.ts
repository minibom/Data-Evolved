// src/game-client/systems/IntelDisseminationSystem.ts
import { BaseSystem } from './BaseSystem';
import type { GameClient } from '../index';
// Define GameIntel type, ideally from @packages/common-types
type GameIntel = any; // Placeholder

export class IntelDisseminationSystem extends BaseSystem {
  private currentIntel: GameIntel[] = [];

  constructor(game: GameClient) {
    super(game);
  }

  public init(): void {
    super.init();
    // Fetch initial game intel or subscribe to updates
    // this.fetchLatestIntel();
  }

  // private async fetchLatestIntel(): Promise<void> {
  //   try {
  //     const intel = await this.game.getApiClient().intel.getLatestIntel();
  //     this.receiveGameIntel(intel);
  //   } catch (error) {
  //     console.error("IntelDisseminationSystem: Failed to fetch latest intel:", error);
  //   }
  // }

  public update(delta: number): void {
    // Could have logic for timed display of intel or cycling through messages
  }

  public receiveGameIntel(intelArray: GameIntel[]): void {
    this.currentIntel = intelArray;
    console.log("IntelDisseminationSystem: Received new game intel.", intelArray);
    // Display the most relevant or latest intel to the player
    if (intelArray.length > 0) {
      // this.displayIntel(intelArray[0]); // Display the first piece of intel as an example
    }
  }

  public displayIntel(intel: GameIntel): void {
    console.log(`IntelDisseminationSystem: Displaying intel - Title: ${intel.title}, Message: ${intel.message}`);
    // Use GameMessageOverlay or another UI component to show the intel
    // this.game.uiManager.getOverlay(GameMessageOverlay).displayIntel(intel); // Example
  }
}

console.log("IntelDisseminationSystem class (src/game-client/systems/IntelDisseminationSystem.ts) created.");
