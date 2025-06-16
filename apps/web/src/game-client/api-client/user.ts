// src/game-client/api-client/user.ts
import type { ApiClient } from './index';
// Define PlayerProfile and PlayerStats types, ideally from @packages/common-types
type PlayerProfile = any; // Placeholder
type PlayerStats = any; // Placeholder

export class UserApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async getProfile(userId: string): Promise<PlayerProfile> {
    // In a real app, userId might come from an auth context
    console.log(`UserApiClient: Fetching profile for user ${userId}.`);
    return this.apiClient.callApi<PlayerProfile>(`/user?userId=${userId}`, undefined, 'GET');
  }

  public async updateStats(userId: string, stats: PlayerStats): Promise<void> {
    console.log(`UserApiClient: Updating stats for user ${userId}.`, stats);
    await this.apiClient.callApi(`/user?userId=${userId}`, stats, 'PUT');
  }
}

console.log("UserApiClient class (src/game-client/api-client/user.ts) loaded.");
