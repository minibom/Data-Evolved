// src/game-client/api-client/faction.ts
import { apiClient } from './index';

// Define interfaces for Faction API responses if not already in common-types
// For example:
// interface FactionInfo { id: string; name: string; description: string; /* ... */ }

export async function getAllFactions(): Promise<any[]> { // Replace 'any'
  return apiClient.fetchApi<any[]>('/faction');
}

export async function getPlayerFaction(playerId: string): Promise<any | null> { // Replace 'any'
  try {
    return await apiClient.fetchApi<any>(`/faction?playerId=${playerId}`);
  } catch (error: any) {
    if (error.message.includes("Player has not chosen a faction")) return null;
    throw error;
  }
}

export async function chooseFaction(playerId: string, factionId: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/faction?playerId=${playerId}`, {
    method: 'POST',
    body: JSON.stringify({ factionId }),
  });
}

// Example for assimilation, if it's a direct API call
export async function undergoAssimilation(playerId: string, newFactionId: string): Promise<any> {
    return apiClient.fetchApi<any>(`/faction?playerId=${playerId}`, {
        method: 'PATCH', // Assuming PATCH for update/change
        body: JSON.stringify({ newFactionId, reason: 'assimilation' })
    });
}


console.log("Game Client Faction API functions (src/game-client/api-client/faction.ts) loaded.");
