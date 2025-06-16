// src/game-client/api-client/crafting.ts
import { apiClient } from './index';

// Define interfaces for Crafting API responses if not already in common-types
// For example:
// interface Recipe { /* ... */ }

export async function getAvailableRecipes(playerId?: string): Promise<any[]> { // Replace 'any'
  const endpoint = playerId ? `/crafting?playerId=${playerId}` : '/crafting';
  return apiClient.fetchApi<any[]>(endpoint);
}

export async function craftItem(playerId: string, recipeId: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/crafting?playerId=${playerId}`, {
    method: 'POST',
    body: JSON.stringify({ recipeId }),
  });
}

export async function upgradeItem(playerId: string, upgradeItemId: string, materialsUsed?: any[]): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/crafting?playerId=${playerId}`, {
    method: 'POST',
    body: JSON.stringify({ upgradeItemId, materialsUsed }), // `materialsUsed` might be determined server-side
  });
}

console.log("Game Client Crafting API functions (src/game-client/api-client/crafting.ts) loaded.");
