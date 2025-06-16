// src/game-client/api-client/pvp.ts
import { apiClient } from './index';

// Define interfaces for PvP API responses if not already in common-types
// For example:
// interface PvpResult { winnerId: string; loserId: string; wasAssimilation: boolean; /* ... */ }

export async function reportPvpEncounter(
  winnerId: string, 
  loserId: string, 
  winnerFactionId?: string, 
  loserFactionId?: string, 
  zoneId?: string
): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>('/pvp', {
    method: 'POST',
    body: JSON.stringify({ winnerId, loserId, winnerFactionId, loserFactionId, zoneId }),
  });
}

export async function getPvpLog(filters?: any): Promise<any[]> { // Replace 'any'
  const queryString = filters ? new URLSearchParams(filters).toString() : '';
  return apiClient.fetchApi<any[]>(`/pvp?${queryString}`);
}

console.log("Game Client PvP API functions (src/game-client/api-client/pvp.ts) loaded.");
