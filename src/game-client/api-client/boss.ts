// src/game-client/api-client/boss.ts
import { apiClient } from './index';

// Define interfaces for Boss API responses if not already in common-types
// For example:
// interface BossInfo { id: string; name: string; currentHp: number; maxHp: number; /* ... */ }

export async function getCurrentBossInfo(): Promise<any | null> { // Replace 'any'
  try {
    return await apiClient.fetchApi<any>('/boss');
  } catch (error: any) {
    if (error.message.includes('404')) return null; // Handle no active boss gracefully
    throw error;
  }
}

export async function joinBossRaid(playerId: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/boss?playerId=${playerId}`, { // Pass playerId as query param
    method: 'POST',
    body: JSON.stringify({ action: 'join' }),
  });
}

export async function attackBoss(playerId: string, damage: number): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/boss?playerId=${playerId}`, { // Pass playerId as query param
    method: 'POST',
    body: JSON.stringify({ action: 'attack', damage }),
  });
}

console.log("Game Client Boss API functions (src/game-client/api-client/boss.ts) loaded.");
