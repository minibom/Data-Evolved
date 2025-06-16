// src/game-client/api-client/zone.ts
import type { ApiClient } from './index';
// Define ZoneStatus type, ideally from @packages/common-types
type ZoneStatus = any; // Placeholder

export class ZoneApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async captureZone(zoneId: string): Promise<void> {
    console.log(`ZoneApiClient: Capturing zone ${zoneId}.`);
    // Assuming an API endpoint like /api/zone/capture
    await this.apiClient.callApi(`/zone/${zoneId}/capture`, {}, 'POST');
  }

  public async getZoneStatus(zoneId: string): Promise<ZoneStatus> {
    console.log(`ZoneApiClient: Getting status for zone ${zoneId}.`);
    // Assuming an API endpoint like /api/zone/:zoneId/status
    return this.apiClient.callApi<ZoneStatus>(`/zone?zoneId=${zoneId}`, undefined, 'GET');
  }

  // From previous implementation
  public async getAllZoneStates(): Promise<any[]> {
    return this.apiClient.callApi<any[]>('/zone', undefined, 'GET');
  }

  public async contributeSyncPoints(playerId: string, playerFactionId: string, zoneId: string, points: number): Promise<any> {
    return this.apiClient.callApi<any>(`/zone?playerId=${playerId}&playerFactionId=${playerFactionId}`, { zoneId, action: 'add_sync_points', value: points }, 'POST');
  }

  public async completeZoneCoreMission(playerId: string, playerFactionId: string, zoneId: string): Promise<any> {
    return this.apiClient.callApi<any>(`/zone?playerId=${playerId}&playerFactionId=${playerFactionId}`, { zoneId, action: 'complete_core_mission' }, 'POST');
  }
}

console.log("ZoneApiClient class (src/game-client/api-client/zone.ts) loaded.");
