// src/game-client/api-client/user.ts
/**
 * UserApiClient provides methods for interacting with user-related backend APIs,
 * such as fetching player profiles, updating stats, or managing faction choices.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define PlayerProfile and PlayerStats types, ideally from @packages/common-types
// For now, using 'any' as placeholder.
type PlayerProfile = any; 
type PlayerStats = any; 

export class UserApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches the profile of a specific user.
   * @param userId The ID of the user whose profile is to be fetched.
   * In a real application, this might be derived from an authenticated session.
   * @returns A promise that resolves with the player's profile.
   */
  public async getProfile(userId: string): Promise<PlayerProfile> {
    console.log(`UserApiClient: Fetching profile for user ${userId}.`);
    // The endpoint might include the userId directly, or it might be inferred server-side from session.
    // Example: '/user/profile' if server infers user, or `/user/${userId}/profile`
    return this.apiClient.callApi<PlayerProfile>(`/user?userId=${userId}`, undefined, 'GET');
  }

  /**
   * Updates the stats for a specific user.
   * @param userId The ID of the user whose stats are to be updated.
   * @param stats An object containing the new stat values.
   * @returns A promise that resolves when the stats have been updated.
   */
  public async updateStats(userId: string, stats: PlayerStats): Promise<void> {
    console.log(`UserApiClient: Updating stats for user ${userId}.`, stats);
    // Using PUT for updating existing resource.
    await this.apiClient.callApi(`/user?userId=${userId}`, stats, 'PUT');
  }

  // Example method if faction choice is handled via User API
  // public async chooseFaction(userId: string, factionId: string): Promise<void> {
  //   console.log(`UserApiClient: User ${userId} choosing faction ${factionId}.`);
  //   await this.apiClient.callApi(`/user/${userId}/faction`, { factionId }, 'POST');
  // }
}

console.log("UserApiClient class (src/game-client/api-client/user.ts) created.");
