// src/game-client/api-client/pvp.ts
import type { ApiClient } from './index';
// Define PvpSession type, ideally from @packages/common-types
type PvpSession = any; // Placeholder

export class PvpApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async initiatePvp(targetId: string): Promise<PvpSession> {
    console.log(`PvpApiClient: Initiating PvP with target ${targetId}.`);
    // Assuming an API endpoint like /api/pvp/initiate
    return this.apiClient.callApi<PvpSession>('/pvp/initiate', { targetId }, 'POST');
  }

  public async assimilatePlayer(targetId: string): Promise<void> {
    console.log(`PvpApiClient: Assimilating player ${targetId}.`);
    // Assuming an API endpoint like /api/pvp/assimilate
    await this.apiClient.callApi('/pvp/assimilate', { targetId }, 'POST');
  }

  // From previous implementation
  public async reportPvpEncounter(
    winnerId: string, 
    loserId: string, 
    winnerFactionId?: string, 
    loserFactionId?: string, 
    zoneId?: string
  ): Promise<any> {
    return this.apiClient.callApi<any>('/pvp', { winnerId, loserId, winnerFactionId, loserFactionId, zoneId }, 'POST');
  }

  public async getPvpLog(filters?: any): Promise<any[]> {
    const queryString = filters ? new URLSearchParams(filters).toString() : '';
    return this.apiClient.callApi<any[]>(`/pvp?${queryString}`, undefined, 'GET');
  }
}

console.log("PvpApiClient class (src/game-client/api-client/pvp.ts) loaded.");
