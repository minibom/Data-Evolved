// src/game-client/api-client/faction.ts
import type { ApiClient } from './index';

export class FactionApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async getAllFactions(): Promise<any[]> { // Replace 'any'
    return this.apiClient.callApi<any[]>('/faction', undefined, 'GET');
  }

  public async getPlayerFaction(playerId: string): Promise<any | null> { // Replace 'any'
    try {
      return await this.apiClient.callApi<any>(`/faction?playerId=${playerId}`, undefined, 'GET');
    } catch (error: any) {
      if (error.message.includes("Player has not chosen a faction")) return null; // Or specific error code
      throw error;
    }
  }

  public async chooseFaction(playerId: string, factionId: string): Promise<any> { // Replace 'any'
    return this.apiClient.callApi<any>(`/faction?playerId=${playerId}`, { factionId }, 'POST');
  }

  public async undergoAssimilation(playerId: string, newFactionId: string): Promise<any> {
      return this.apiClient.callApi<any>(`/faction?playerId=${playerId}`, { newFactionId, reason: 'assimilation' }, 'PATCH');
  }
}
console.log("FactionApiClient class (src/game-client/api-client/faction.ts) created.");
