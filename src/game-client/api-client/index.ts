// src/game-client/api-client/index.ts
// This file serves as a central export point for all game client API functions.

// import * as gameStateApi from './gameState';
// import * as userApi from './user';
import * as shopApi from './shop';
import * as guildApi from './guild';
import * as bossApi from './boss';
import * as socialApi from './social';
import * as tradeApi from './trade';
import * as craftingApi from './crafting';
import * as factionApi from './faction';
import * as zoneApi from './zone';
import * as pvpApi from './pvp';
// import * as inventoryApi from './inventory';
// import * as questApi from './quest';
// import * as achievementApi from './achievements';

// Base URL for your game's API
const API_BASE_URL = '/api'; // Adjust if your API is hosted elsewhere or has a prefix

// Helper function for making API requests
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Add any default headers like Authorization token if needed
      ...(options?.headers),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'API request failed with status: ' + response.status }));
    throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}


export const apiClient = {
  // Example:
  // getGameState: (playerId: string) => fetchApi<any>(`/game-state?playerId=${playerId}`),
  // saveGameState: (stateData: any) => fetchApi<any>(`/game-state`, { method: 'POST', body: JSON.stringify(stateData) }),
  // getUserProfile: (userId: string) => fetchApi<any>(`/user?userId=${userId}`),
  // updateUserProfile: (userId: string, updates: any) => fetchApi<any>(`/user?userId=${userId}`, { method: 'PUT', body: JSON.stringify(updates) }),

  ...shopApi,
  ...guildApi,
  ...bossApi,
  ...socialApi,
  ...tradeApi,
  ...craftingApi,
  ...factionApi,
  ...zoneApi,
  ...pvpApi,
  // ... other exported API modules
  fetchApi, // Expose the raw fetcher if needed
};

console.log("Game Client API Client module (src/game-client/api-client/index.ts) loaded.");
