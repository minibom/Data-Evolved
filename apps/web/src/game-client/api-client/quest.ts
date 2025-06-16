// src/game-client/api-client/quest.ts
/**
 * QuestApiClient provides methods for interacting with quest-related backend APIs.
 * This includes fetching available quests, player's active/completed quests,
 * accepting quests, and updating quest progress.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define Quest, PlayerQuest types, ideally from @packages/common-types/game
// For now, using 'any' as placeholder.
type Quest = any; 
type PlayerQuest = any; // Represents a quest in a player's log with its status

export class QuestApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches quests available to a player, potentially based on level, faction, or location.
   * @param playerId The ID of the player.
   * @param zoneId Optional. If provided, fetches quests available in a specific zone.
   * @returns A promise that resolves with an array of available quest definitions.
   */
  public async getAvailableQuests(playerId: string, zoneId?: string): Promise<Quest[]> {
    let endpoint = `/quest/available?playerId=${playerId}`;
    if (zoneId) endpoint += `&zoneId=${zoneId}`;
    console.log(`QuestApiClient: Fetching available quests for player ${playerId}${zoneId ? ` in zone ${zoneId}` : ''}.`);
    return this.apiClient.callApi<Quest[]>(endpoint, undefined, 'GET');
  }

  /**
   * Fetches the quest log for a specific player, including active and completed quests.
   * @param playerId The ID of the player.
   * @returns A promise that resolves with an array of the player's quests and their statuses.
   */
  public async getPlayerQuests(playerId: string): Promise<PlayerQuest[]> {
    console.log(`QuestApiClient: Fetching quest log for player ${playerId}.`);
    return this.apiClient.callApi<PlayerQuest[]>(`/quest?playerId=${playerId}`, undefined, 'GET');
  }

  /**
   * Allows a player to accept a quest.
   * @param playerId The ID of the player.
   * @param questId The ID of the quest to accept.
   * @returns A promise that resolves with the updated player quest entry.
   */
  public async acceptQuest(playerId: string, questId: string): Promise<PlayerQuest> {
    console.log(`QuestApiClient: Player ${playerId} accepting quest ${questId}.`);
    return this.apiClient.callApi<PlayerQuest>(`/quest?playerId=${playerId}`, { action: 'accept', questId }, 'POST');
  }

  /**
   * Updates the progress of a specific objective within a player's active quest.
   * @param playerId The ID of the player.
   * @param questId The ID of the active quest.
   * @param objectiveId The ID or index of the objective being updated.
   * @param progress An object detailing the progress update (e.g., { currentCount: 5 }).
   * @returns A promise that resolves with the updated player quest entry.
   */
  public async updateQuestProgress(playerId: string, questId: string, objectiveId: string | number, progress: any): Promise<PlayerQuest> {
    console.log(`QuestApiClient: Player ${playerId} updating progress for quest ${questId}, objective ${objectiveId}. Progress:`, progress);
    return this.apiClient.callApi<PlayerQuest>(`/quest?playerId=${playerId}`, { action: 'progress', questId, objectiveId, progress }, 'POST'); // Or PATCH
  }

  /**
   * Allows a player to turn in a completed quest.
   * The server will verify completion and distribute rewards.
   * @param playerId The ID of the player.
   * @param questId The ID of the quest to complete.
   * @returns A promise that resolves with the outcome (e.g., rewards, next quest).
   */
  public async completeQuest(playerId: string, questId: string): Promise<any> {
    console.log(`QuestApiClient: Player ${playerId} completing quest ${questId}.`);
    return this.apiClient.callApi<any>(`/quest?playerId=${playerId}`, { action: 'complete', questId }, 'POST');
  }

  /**
   * Allows a player to abandon an active quest.
   * @param playerId The ID of the player.
   * @param questId The ID of the quest to abandon.
   * @returns A promise that resolves upon successful abandonment.
   */
  public async abandonQuest(playerId: string, questId: string): Promise<void> {
      console.log(`QuestApiClient: Player ${playerId} abandoning quest ${questId}.`);
      await this.apiClient.callApi(`/quest?playerId=${playerId}`, { action: 'abandon', questId }, 'POST'); // Or DELETE
  }
}

console.log("QuestApiClient class (src/game-client/api-client/quest.ts) created.");
