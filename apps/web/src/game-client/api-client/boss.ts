// src/game-client/api-client/boss.ts
/**
 * BossApiClient provides methods for interacting with World Boss related backend APIs,
 * such as getting current boss information, joining raids, and reporting damage.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define WorldBoss, ActiveBossEncounter types, ideally from @packages/common-types/boss
// For now, using 'any' as placeholder.
type ActiveBossEncounter = any; 

export class BossApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches information about the currently active world boss, if any.
   * @returns A promise that resolves with the active boss encounter details, or null if no boss is active.
   */
  public async getCurrentBossInfo(): Promise<ActiveBossEncounter | null> {
    console.log("BossApiClient: Fetching current world boss information.");
    try {
      return await this.apiClient.callApi<ActiveBossEncounter>('/boss', undefined, 'GET');
    } catch (error: any) {
      // Assuming 404 means no active boss, other errors should be thrown
      if (error.message && (error.message.includes('404') || error.message.toLowerCase().includes('not found'))) {
        console.log("BossApiClient: No active world boss found.");
        return null;
      }
      console.error("BossApiClient: Error fetching boss info:", error);
      throw error; // Re-throw other errors
    }
  }

  /**
   * Allows a player to join an active boss raid.
   * @param playerId The ID of the player joining the raid.
   * @param bossEncounterId The ID of the specific boss encounter to join.
   * @returns A promise that resolves with details of the player's participation or success status.
   */
  public async joinBossRaid(playerId: string, bossEncounterId: string): Promise<any> {
    console.log(`BossApiClient: Player ${playerId} attempting to join raid for boss encounter ${bossEncounterId}.`);
    // The API might be POST /boss/{encounterId}/join or similar
    return this.apiClient.callApi<any>(`/boss?playerId=${playerId}`, { action: 'join_raid', bossEncounterId }, 'POST');
  }

  /**
   * Reports damage dealt by a player to the current boss.
   * @param playerId The ID of the player who dealt damage.
   * @param bossEncounterId The ID of the boss encounter.
   * @param damageAmount The amount of damage dealt.
   * @returns A promise that resolves with the updated boss health or encounter status.
   */
  public async attackBoss(playerId: string, bossEncounterId: string, damageAmount: number): Promise<any> {
    console.log(`BossApiClient: Player ${playerId} attacking boss ${bossEncounterId} for ${damageAmount} damage.`);
    return this.apiClient.callApi<any>(`/boss?playerId=${playerId}`, { action: 'attack_boss', bossEncounterId, damage: damageAmount }, 'POST');
  }

  // Add other methods if needed:
  // - Get boss loot table
  // - Report boss defeat (might be server-authoritative)
}

console.log("BossApiClient class (src/game-client/api-client/boss.ts) created.");
