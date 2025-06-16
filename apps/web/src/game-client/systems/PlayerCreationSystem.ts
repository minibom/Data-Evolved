// @/game-client/systems/PlayerCreationSystem.ts
import { BaseSystem } from './BaseSystem';
import type { GameClient } from '../core/GameClient';
// import type { PlayerData } from '@packages/common-types/game'; // Assuming this type exists for the player character

export class PlayerCreationSystem extends BaseSystem {
  constructor(game: GameClient) {
    super(game);
    console.log("PlayerCreationSystem initialized.");
  }

  public init(): void {
    super.init();
    // Initialization logic for the system, if any.
    // e.g., listen for events related to post-registration to trigger UI.
  }

  public update(delta: number): void {
    // System update logic, if any (e.g., handling UI interactions for character creation).
  }

  /**
   * Handles the submission of character creation data from the UI.
   * @param creationData Data collected from the character creation form.
   *                     This should align with what the backend API expects.
   *                     Example: { name: string, factionId: string, appearance: { primaryColor: string } }
   */
  public async submitCharacterData(creationData: { name: string; factionId?: string; appearance: { primaryColor: string; secondaryColor: string } }): Promise<boolean> {
    console.log("PlayerCreationSystem: Submitting character data to backend...", creationData);
    try {
      // Assuming GameClient has an ApiClient instance
      // For now, using a direct fetch as ApiClient structure is evolving, or might be called from page directly.
      const response = await fetch('/api/game/character', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Include Authorization header if authentication is set up:
          // 'Authorization': `Bearer ${await this.game.authContext.currentUser?.getIdToken()}` // Example if auth context is available
        },
        body: JSON.stringify(creationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("PlayerCreationSystem: Failed to create character on server.", errorData.error || response.statusText);
        this.game.eventManager.publish({ type: "CLIENT_ERROR_TOAST", data: { title: "Creation Failed", description: errorData.error || 'Server error' } });
        return false;
      }

      const createdCharacterResponse = await response.json();
      console.log("PlayerCreationSystem: Character created successfully on server.", createdCharacterResponse.character);
      
      // After successful creation on the server:
      // 1. Update local player state in GameClient or related systems.
      //    this.game.playerManager.setMainPlayer(createdCharacterResponse.character); // Example, assuming a playerManager
      
      // 2. Publish an event that character was created (e.g., to update UI or trigger game start)
      this.game.eventManager.publish({ type: 'PLAYER_CHARACTER_CREATED', data: createdCharacterResponse.character });
      
      // Optionally show a success toast
      this.game.eventManager.publish({ type: "CLIENT_SUCCESS_TOAST", data: { title: "Entity Manifested!", description: `Welcome to the Nexus, ${creationData.name}!` } });
      
      return true;
    } catch (error) {
      console.error("PlayerCreationSystem: Error submitting character data.", error);
      this.game.eventManager.publish({ type: "CLIENT_ERROR_TOAST", data: { title: "Creation Error", description: "An unexpected error occurred." } });
      return false;
    }
  }

  public destroy(): void {
    super.destroy();
    // Cleanup logic, if any.
  }
}

console.log("PlayerCreationSystem (placeholder) class created.");
