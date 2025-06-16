// src/game-client/api-client/pvp.ts
/**
 * PvpApiClient provides methods for interacting with PvP-related backend APIs,
 * including initiating duels, reporting encounter results, and handling assimilation.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define PvpSession, PvpResult types, ideally from @packages/common-types
// For now, using 'any' as placeholder.
type PvpSession = any;
type PvpResult = any; 

export class PvpApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Initiates a PvP encounter with a target player.
   * @param playerId The ID of the player initiating the duel.
   * @param targetId The ID of the player being challenged.
   * @returns A promise that resolves with the PvP session details if successful.
   */
  public async initiatePvp(playerId: string, targetId: string): Promise<PvpSession> {
    console.log(`PvpApiClient: Player ${playerId} initiating PvP with target ${targetId}.`);
    // The API might be POST /pvp/initiate or similar
    return this.apiClient.callApi<PvpSession>('/pvp/initiate', { playerId, targetId }, 'POST');
  }

  /**
   * Reports the result of a PvP encounter.
   * This is typically called by the server after validating combat, or by a client in some game designs.
   * @param resultData Data about the PvP encounter result.
   * @returns A promise that resolves with the logged encounter details.
   */
  public async reportPvpEncounter(resultData: {
    winnerId: string, 
    loserId: string, 
    winnerFactionId?: string, 
    loserFactionId?: string, 
    zoneId?: string
  }): Promise<PvpResult> {
    console.log("PvpApiClient: Reporting PvP encounter result:", resultData);
    return this.apiClient.callApi<PvpResult>('/pvp', resultData, 'POST');
  }
  
  /**
   * Fetches the PvP log, possibly with filters.
   * @param filters Optional query parameters for filtering the log.
   * @returns A promise that resolves with an array of PvP encounter results.
   */
  public async getPvpLog(filters?: any): Promise<PvpResult[]> {
    const queryString = filters ? '?' + new URLSearchParams(filters).toString() : '';
    console.log(`PvpApiClient: Fetching PvP log with filters: ${queryString}`);
    return this.apiClient.callApi<PvpResult[]>(`/pvp${queryString}`, undefined, 'GET');
  }


  /**
   * Triggers the assimilation process for a defeated player.
   * This is usually a consequence of a PvP defeat under certain conditions.
   * @param victoriousPlayerId The ID of the player who won and is causing the assimilation.
   * @param defeatedPlayerId The ID of the player being assimilated.
   * @param newFactionId The ID of the faction the defeated player will be assimilated into.
   * @returns A promise that resolves when the assimilation process is initiated server-side.
   */
  public async assimilatePlayer(victoriousPlayerId: string, defeatedPlayerId: string, newFactionId: string): Promise<void> {
    console.log(`PvpApiClient: Player ${victoriousPlayerId} assimilating player ${defeatedPlayerId} into faction ${newFactionId}.`);
    // The API might be POST /pvp/assimilate or part of the faction change API.
    // This call informs the server to update the defeatedPlayerId's faction.
    await this.apiClient.callApi('/pvp/assimilate', { victoriousPlayerId, defeatedPlayerId, newFactionId }, 'POST');
  }
}

console.log("PvpApiClient class (src/game-client/api-client/pvp.ts) created and updated.");
