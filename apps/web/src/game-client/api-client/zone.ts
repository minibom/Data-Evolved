// src/game-client/api-client/zone.ts
/**
 * ZoneApiClient provides methods for interacting with game zones,
 * such as capturing zones, getting status, contributing resources, or completing core missions.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define ZoneStatus type, ideally from @packages/common-types/db (e.g., ZoneStateDoc)
// For now, using 'any' as placeholder.
type ZoneStatus = any;

export class ZoneApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches the current status of all game zones.
   * @returns A promise that resolves with an array of zone statuses.
   */
  public async getAllZoneStates(): Promise<ZoneStatus[]> {
    console.log("ZoneApiClient: Fetching all zone states.");
    return this.apiClient.callApi<ZoneStatus[]>('/zone', undefined, 'GET');
  }

  /**
   * Fetches the detailed status of a specific game zone.
   * @param zoneId The ID of the zone.
   * @returns A promise that resolves with the zone's status.
   */
  public async getZoneStatus(zoneId: string): Promise<ZoneStatus> {
    console.log(`ZoneApiClient: Getting status for zone ${zoneId}.`);
    return this.apiClient.callApi<ZoneStatus>(`/zone?zoneId=${zoneId}`, undefined, 'GET');
  }

  /**
   * Attempts to capture a zone for the player's faction.
   * This would typically be allowed if the zone is contested and player meets criteria.
   * @param playerId The ID of the player attempting the capture.
   * @param playerFactionId The ID of the player's faction.
   * @param zoneId The ID of the zone to capture.
   * @returns A promise that resolves with the updated zone status or success message.
   */
  public async captureZone(playerId: string, playerFactionId: string, zoneId: string): Promise<any> {
    console.log(`ZoneApiClient: Player ${playerId} (${playerFactionId}) attempting to capture zone ${zoneId}.`);
    // The API might be POST /zone/{zoneId}/capture or similar
    return this.apiClient.callApi(`/zone/${zoneId}/capture`, { playerId, playerFactionId }, 'POST');
  }


  /**
   * Allows a player to contribute synchronization points to a zone for their faction.
   * @param playerId The ID of the player.
   * @param playerFactionId The ID of the player's faction.
   * @param zoneId The ID of the zone.
   * @param points The amount of synchronization points to contribute.
   * @returns A promise that resolves with the updated zone status.
   */
  public async contributeSyncPoints(playerId: string, playerFactionId: string, zoneId: string, points: number): Promise<ZoneStatus> {
    console.log(`ZoneApiClient: Player ${playerId} (${playerFactionId}) contributing ${points} sync points to zone ${zoneId}.`);
    return this.apiClient.callApi<ZoneStatus>(
      `/zone?playerId=${playerId}&playerFactionId=${playerFactionId}`, // Query params for identification
      { zoneId, action: 'add_sync_points', value: points }, 
      'POST'
    );
  }

  /**
   * Marks a zone's core mission as completed by a player for their faction.
   * This can trigger the "Contested" phase for the zone.
   * @param playerId The ID of the player.
   * @param playerFactionId The ID of the player's faction.
   * @param zoneId The ID of the zone.
   * @returns A promise that resolves with the updated zone status.
   */
  public async completeZoneCoreMission(playerId: string, playerFactionId: string, zoneId: string): Promise<ZoneStatus> {
    console.log(`ZoneApiClient: Player ${playerId} (${playerFactionId}) completed core mission in zone ${zoneId}.`);
    return this.apiClient.callApi<ZoneStatus>(
      `/zone?playerId=${playerId}&playerFactionId=${playerFactionId}`, // Query params for identification
      { zoneId, action: 'complete_core_mission' }, 
      'POST'
    );
  }

  // Add other methods like initiating zone upgrades, deploying faction defenses, etc.
}

console.log("ZoneApiClient class (src/game-client/api-client/zone.ts) created and updated.");
