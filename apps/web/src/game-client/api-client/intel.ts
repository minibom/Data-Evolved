// src/game-client/api-client/intel.ts
/**
 * IntelApiClient provides methods for fetching game intelligence,
 * which could be AI-generated propaganda, strategic advice, or world event summaries.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define GameIntel type, ideally from @packages/common-types or a specific AI flow output type.
// For now, using 'any' as placeholder.
type GameIntel = any;

export class IntelApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches the latest game intelligence.
   * This could be targeted to the player based on their faction, location, or recent actions.
   * @param playerId Optional. The ID of the player requesting intel, for personalized results.
   * @returns A promise that resolves with an array of game intel items.
   */
  public async getLatestIntel(playerId?: string): Promise<GameIntel[]> {
    console.log(`IntelApiClient: Fetching latest game intel${playerId ? ` for player ${playerId}` : ''}.`);
    
    let endpoint = '/intel'; // General intel endpoint
    if (playerId) {
      endpoint = `/intel?playerId=${playerId}`; // Endpoint for personalized intel
    }
    // The backend API, e.g., `/api/intel`, would handle this.
    // It might call the `strategicIntel` or `narrativeWeaver` Genkit flows.
    return this.apiClient.callApi<GameIntel[]>(endpoint, undefined, 'GET');
  }

  // Potentially add methods to:
  // - Report player observations that could become intel.
  // - Acknowledge receipt or usefulness of intel.
}

console.log("IntelApiClient class (src/game-client/api-client/intel.ts) created.");
