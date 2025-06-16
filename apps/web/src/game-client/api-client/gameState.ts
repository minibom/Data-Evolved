// src/game-client/api-client/gameState.ts
/**
 * GameStateApiClient provides methods for saving and loading player-specific game state.
 * This typically includes player stats, inventory, quest progress, location, etc.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define GameState type, ideally from @packages/common-types/game
// For now, using 'any' as placeholder.
type GameState = any; 

export class GameStateApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Loads the game state for a specific player.
   * This is typically called when a player logs in or resumes a game session.
   * @param playerId The ID of the player whose game state is to be loaded.
   * @returns A promise that resolves with the player's game state.
   */
  public async loadGameState(playerId: string): Promise<GameState> {
    console.log(`GameStateApiClient: Loading game state for player ${playerId}.`);
    return this.apiClient.callApi<GameState>(`/game-state?playerId=${playerId}`, undefined, 'GET');
  }

  /**
   * Saves the game state for a specific player.
   * This can be called periodically or at key moments (e.g., before logout, after completing a major quest).
   * @param playerId The ID of the player whose game state is to be saved.
   * @param stateData The complete or partial game state data to save.
   * @returns A promise that resolves when the game state is successfully saved.
   */
  public async saveGameState(playerId: string, stateData: GameState): Promise<void> {
    console.log(`GameStateApiClient: Saving game state for player ${playerId}.`, stateData);
    // The API route `/api/game-state` should handle POST requests for saving.
    // It might infer playerId from session or require it in the body/query.
    await this.apiClient.callApi(`/game-state`, { playerId, ...stateData }, 'POST');
  }

  // Potentially add methods for specific partial state updates if needed,
  // though often `saveGameState` can handle partial updates if the backend supports merging.
}

console.log("GameStateApiClient class (src/game-client/api-client/gameState.ts) created.");
