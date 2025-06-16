// src/game-client/api-client/guild.ts
/**
 * GuildApiClient provides methods for interacting with guild (Faction Hub) related backend APIs.
 * This includes creating, joining, leaving, and managing guilds.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define Guild, GuildMember types, ideally from @packages/common-types/guild
// For now, using 'any' as placeholder.
type Guild = any;
type GuildMember = any;

export class GuildApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches a list of all guilds or guilds matching certain criteria.
   * @param filters Optional query parameters for filtering guilds (e.g., by name, faction affinity).
   * @returns A promise that resolves with an array of guilds.
   */
  public async getGuildsList(filters?: any): Promise<Guild[]> {
    const queryString = filters ? '?' + new URLSearchParams(filters).toString() : '';
    console.log(`GuildApiClient: Fetching guilds list with filters: ${queryString}`);
    return this.apiClient.callApi<Guild[]>(`/guild${queryString}`, undefined, 'GET');
  }

  /**
   * Fetches detailed information for a specific guild.
   * @param guildId The ID of the guild to fetch.
   * @returns A promise that resolves with the guild details.
   */
  public async getGuildDetails(guildId: string): Promise<Guild> {
    console.log(`GuildApiClient: Fetching details for guild ${guildId}.`);
    return this.apiClient.callApi<Guild>(`/guild?guildId=${guildId}`, undefined, 'GET');
  }

  /**
   * Creates a new guild.
   * @param playerId The ID of the player creating the guild (will be the leader).
   * @param name The desired name for the guild.
   * @param description A short description or motto for the guild.
   * @param factionAffinity Optional. The faction the guild aligns with.
   * @returns A promise that resolves with the newly created guild's details.
   */
  public async createGuild(playerId: string, name: string, description: string, factionAffinity?: string): Promise<Guild> {
    console.log(`GuildApiClient: Player ${playerId} creating guild "${name}". Affinity: ${factionAffinity}`);
    return this.apiClient.callApi<Guild>('/guild', { action: 'create', playerId, name, description, factionAffinity }, 'POST');
  }

  /**
   * Allows a player to join an existing guild.
   * Server might check for open slots, invitations, or other requirements.
   * @param playerId The ID of the player joining.
   * @param guildId The ID of the guild to join.
   * @returns A promise that resolves with the updated guild details or player status.
   */
  public async joinGuild(playerId: string, guildId: string): Promise<any> {
    console.log(`GuildApiClient: Player ${playerId} attempting to join guild ${guildId}.`);
    return this.apiClient.callApi('/guild', { action: 'join', playerId, guildId }, 'POST');
  }

  /**
   * Allows a player to leave their current guild.
   * @param playerId The ID of the player leaving.
   * @param guildId The ID of the guild being left.
   * @returns A promise that resolves on successful departure.
   */
  public async leaveGuild(playerId: string, guildId: string): Promise<void> {
    console.log(`GuildApiClient: Player ${playerId} attempting to leave guild ${guildId}.`);
    await this.apiClient.callApi('/guild', { action: 'leave', playerId, guildId }, 'POST');
  }

  // Add more methods as needed:
  // - inviteToGuild(inviterId: string, inviteeId: string, guildId: string)
  // - kickFromGuild(kickerId: string, kickeeId: string, guildId: string)
  // - promoteMember(promoterId: string, promoteeId: string, guildId: string, newRank: string)
  // - updateGuildSettings(updaterId: string, guildId: string, settings: Partial<Guild>)
}

console.log("GuildApiClient class (src/game-client/api-client/guild.ts) created.");
