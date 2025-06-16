// src/game-client/api-client/anomalyDungeon.ts
import type { ApiClient } from './index';
// Define DungeonSession type, ideally from @packages/common-types
type DungeonSession = any; // Placeholder

export class AnomalyDungeonApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async enterDungeon(dungeonId: string): Promise<DungeonSession> {
    console.log(`AnomalyDungeonApiClient: Entering dungeon ${dungeonId}.`);
    // Assuming an API endpoint like /api/anomaly-dungeon/enter
    return this.apiClient.callApi<DungeonSession>('/anomaly-dungeon/enter', { dungeonId }, 'POST');
  }

  public async updateProgress(dungeonId: string, progress: any): Promise<void> {
    console.log(`AnomalyDungeonApiClient: Updating progress for dungeon ${dungeonId}.`, progress);
    // Assuming an API endpoint like /api/anomaly-dungeon/progress
    await this.apiClient.callApi('/anomaly-dungeon/progress', { dungeonId, progress }, 'POST');
  }
}

console.log("AnomalyDungeonApiClient class (src/game-client/api-client/anomalyDungeon.ts) loaded.");
