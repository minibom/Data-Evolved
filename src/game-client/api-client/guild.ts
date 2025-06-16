// src/game-client/api-client/guild.ts
import { apiClient } from './index';

// Define interfaces for Guild API responses if not already in common-types
// For example:
// interface GuildDetails { id: string; name: string; members: string[]; /* ... */ }

export async function getGuildsList(): Promise<any[]> { // Replace 'any'
  return apiClient.fetchApi<any[]>('/guild');
}

export async function getGuildDetails(guildId: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/guild?guildId=${guildId}`);
}

export async function createGuild(playerId: string, name: string, description: string, factionAffinity?: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>('/guild', { // Assuming playerId is handled by session or passed in body
    method: 'POST',
    body: JSON.stringify({ action: 'create', playerId, name, description, factionAffinity }),
  });
}

export async function joinGuild(playerId: string, guildId: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>('/guild', {
    method: 'POST', // Or PATCH
    body: JSON.stringify({ action: 'join', playerId, guildId }),
  });
}

// Add other guild actions: leaveGuild, manageMembers, etc.

console.log("Game Client Guild API functions (src/game-client/api-client/guild.ts) loaded.");
