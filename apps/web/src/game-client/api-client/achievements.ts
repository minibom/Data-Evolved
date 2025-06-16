// src/game-client/api-client/achievements.ts
/**
 * AchievementApiClient provides methods for interacting with achievement-related backend APIs.
 * This includes fetching all available achievements, player's unlocked achievements,
 * and potentially reporting actions that might unlock achievements.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define Achievement type, ideally from @packages/common-types/game or a dedicated achievement type file.
// For now, using 'any' as placeholder.
type Achievement = any; 
interface PlayerAchievementStatus extends Achievement {
  isUnlocked: boolean;
  unlockedAt?: string; // ISO date string
}

export class AchievementApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches all available achievements in the game.
   * @returns A promise that resolves with an array of all achievement definitions.
   */
  public async getAllAchievements(): Promise<Achievement[]> {
    console.log("AchievementApiClient: Fetching all available achievements.");
    return this.apiClient.callApi<Achievement[]>('/achievements', undefined, 'GET');
  }

  /**
   * Fetches the achievements status for a specific player, indicating which are unlocked.
   * @param playerId The ID of the player.
   * @returns A promise that resolves with an array of achievements including their unlock status for the player.
   */
  public async getPlayerAchievements(playerId: string): Promise<PlayerAchievementStatus[]> {
    console.log(`AchievementApiClient: Fetching achievements for player ${playerId}.`);
    return this.apiClient.callApi<PlayerAchievementStatus[]>(`/achievements?playerId=${playerId}`, undefined, 'GET');
  }

  /**
   * Reports a player action to the server that might trigger an achievement unlock.
   * The server would then validate the action against achievement criteria.
   * @param playerId The ID of the player performing the action.
   * @param eventType A string identifying the type of event (e.g., 'ENEMY_KILLED', 'ZONE_CAPTURED').
   * @param eventData Any data associated with the event (e.g., { enemyType: 'corrupted_drone', count: 1 }).
   * @returns A promise that resolves with information about any newly unlocked achievements.
   */
  public async reportAchievementProgress(playerId: string, eventType: string, eventData: any): Promise<{ newlyUnlocked?: Achievement[] }> {
    console.log(`AchievementApiClient: Player ${playerId} reporting achievement event: ${eventType}`, eventData);
    return this.apiClient.callApi<{ newlyUnlocked?: Achievement[] }>(
      `/achievements?playerId=${playerId}`, 
      { eventType, eventData, action: 'report_progress' }, 
      'POST'
    );
  }
}

console.log("AchievementApiClient class (src/game-client/api-client/achievements.ts) created.");
