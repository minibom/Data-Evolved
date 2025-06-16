// src/game-client/api-client/faction.ts
/**
 * FactionApiClient provides methods for interacting with faction-related backend APIs.
 * This includes fetching faction information, allowing players to choose factions,
 * and handling faction-specific actions like assimilation.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define FactionInfo, PlayerFactionStatus types, ideally from @packages/common-types/faction or game
// For now, using 'any' as placeholder.
type FactionInfo = any; 
type PlayerFactionStatus = any;

export class FactionApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches a list of all available factions in the game.
   * @returns A promise that resolves with an array of faction information objects.
   */
  public async getAllFactions(): Promise<FactionInfo[]> {
    console.log("FactionApiClient: Fetching all available factions.");
    return this.apiClient.callApi<FactionInfo[]>('/faction', undefined, 'GET');
  }

  /**
   * Fetches the faction status for a specific player.
   * This would indicate which faction the player belongs to, if any.
   * @param playerId The ID of the player.
   * @returns A promise that resolves with the player's faction status, or null if not in a faction.
   */
  public async getPlayerFaction(playerId: string): Promise<PlayerFactionStatus | null> {
    console.log(`FactionApiClient: Fetching faction status for player ${playerId}.`);
    try {
      // The API might return a 404 or a specific message if the player hasn't chosen a faction.
      return await this.apiClient.callApi<PlayerFactionStatus>(`/faction?playerId=${playerId}`, undefined, 'GET');
    } catch (error: any) {
      if (error.message && (error.message.includes("404") || error.message.toLowerCase().includes("not chosen a faction"))) {
        console.log(`FactionApiClient: Player ${playerId} has not chosen a faction.`);
        return null;
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Allows a player to choose a faction.
   * The server will validate if the player meets requirements (e.g., GHZ level).
   * @param playerId The ID of the player.
   * @param factionId The ID of the faction to join (e.g., "AICore", "Hacker").
   * @returns A promise that resolves with the updated player faction status.
   */
  public async chooseFaction(playerId: string, factionId: string): Promise<PlayerFactionStatus> {
    console.log(`FactionApiClient: Player ${playerId} choosing faction ${factionId}.`);
    return this.apiClient.callApi<PlayerFactionStatus>(`/faction?playerId=${playerId}`, { factionId, action: 'choose' }, 'POST');
  }

  /**
   * Processes the assimilation of a player into a new faction.
   * This is typically a consequence of PvP defeat under specific game rules.
   * @param playerId The ID of the player being assimilated.
   * @param newFactionId The ID of the faction the player is being assimilated into.
   * @param reason Optional reason for assimilation (e.g., 'pvp_defeat').
   * @returns A promise that resolves with the updated player faction status.
   */
  public async undergoAssimilation(playerId: string, newFactionId: string, reason?: string): Promise<PlayerFactionStatus> {
    console.log(`FactionApiClient: Player ${playerId} undergoing assimilation into faction ${newFactionId}. Reason: ${reason || 'N/A'}`);
    // This might use a PATCH request to update the player's faction.
    return this.apiClient.callApi<PlayerFactionStatus>(`/faction?playerId=${playerId}`, { newFactionId, reason, action: 'assimilate' }, 'PATCH');
  }

  // Add other faction-related methods if needed:
  // - Get faction-specific buffs or resources
  // - Get faction leaderboards or member lists
}

console.log("FactionApiClient class (src/game-client/api-client/faction.ts) created and updated.");
