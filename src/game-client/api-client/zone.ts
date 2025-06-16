// src/game-client/api-client/zone.ts
import { apiClient } from './index';

// Define interfaces for Zone API responses if not already in common-types
// For example:
// interface ZoneDetails { id: string; name: string; controllingFaction: string; /* ... */ }

export async function getAllZoneStates(): Promise<any[]> { // Replace 'any'
  return apiClient.fetchApi<any[]>('/zone');
}

export async function getZoneDetails(zoneId: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/zone?zoneId=${zoneId}`);
}

export async function contributeSyncPoints(playerId: string, playerFactionId: string, zoneId: string, points: number): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/zone?playerId=${playerId}&playerFactionId=${playerFactionId}`, {
    method: 'POST',
    body: JSON.stringify({ zoneId, action: 'add_sync_points', value: points }),
  });
}

export async function completeZoneCoreMission(playerId: string, playerFactionId: string, zoneId: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/zone?playerId=${playerId}&playerFactionId=${playerFactionId}`, {
    method: 'POST',
    body: JSON.stringify({ zoneId, action: 'complete_core_mission' }),
  });
}

// Add other zone interactions like starting upgrades, etc.

console.log("Game Client Zone API functions (src/game-client/api-client/zone.ts) loaded.");
