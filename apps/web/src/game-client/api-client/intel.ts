// src/game-client/api-client/intel.ts
import type { ApiClient } from './index';
// Define GameIntel type, ideally from @packages/common-types
type GameIntel = any; // Placeholder

export class IntelApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async getLatestIntel(): Promise<GameIntel[]> {
    console.log("IntelApiClient: Fetching latest game intel.");
    // Assuming an API endpoint like /api/intel
    return this.apiClient.callApi<GameIntel[]>('/intel', undefined, 'GET');
  }
}

console.log("IntelApiClient class (src/game-client/api-client/intel.ts) loaded.");
