// src/game-client/api-client/social.ts
/**
 * SocialApiClient provides methods for interacting with social features like friends lists and chat.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define Friend, ChatMessage types, ideally from @packages/common-types/social or game
// For now, using 'any' as placeholder.
type Friend = any; 
type ChatMessage = any;
interface FriendsData {
  friends: Friend[];
  pendingRequests: Friend[]; // Requests received by the player
  sentRequests: Friend[]; // Requests sent by the player
}

export class SocialApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // --- Friends List Methods ---

  /**
   * Fetches the friends list and pending/sent requests for a player.
   * @param playerId The ID of the player.
   * @returns A promise that resolves with the player's friends data.
   */
  public async getFriendsList(playerId: string): Promise<FriendsData> {
    console.log(`SocialApiClient: Fetching friends list for player ${playerId}.`);
    return this.apiClient.callApi<FriendsData>(`/social/friends?playerId=${playerId}`, undefined, 'GET');
  }

  /**
   * Sends a friend request from one player to another.
   * @param senderPlayerId The ID of the player sending the request.
   * @param targetPlayerId The ID of the player to whom the request is sent.
   * @returns A promise that resolves on successful request submission.
   */
  public async sendFriendRequest(senderPlayerId: string, targetPlayerId: string): Promise<void> {
    console.log(`SocialApiClient: Player ${senderPlayerId} sending friend request to ${targetPlayerId}.`);
    await this.apiClient.callApi(`/social/friends?senderPlayerId=${senderPlayerId}`, { targetPlayerId, action: 'send_request' }, 'POST');
  }

  /**
   * Responds to a pending friend request (accept or decline).
   * @param playerId The ID of the player responding to the request.
   * @param requestPlayerId The ID of the player who sent the friend request.
   * @param status 'accepted' or 'declined'.
   * @returns A promise that resolves when the response is processed.
   */
  public async respondToFriendRequest(playerId: string, requestPlayerId: string, status: 'accepted' | 'declined'): Promise<void> {
    console.log(`SocialApiClient: Player ${playerId} responding '${status}' to friend request from ${requestPlayerId}.`);
    await this.apiClient.callApi(`/social/friends?playerId=${playerId}`, { requestPlayerId, status, action: 'respond_request' }, 'PATCH'); // Using PATCH for update
  }

  /**
   * Removes a friend.
   * @param playerId The ID of the player initiating the removal.
   * @param friendToRemoveId The ID of the friend to remove.
   * @returns A promise that resolves on successful removal.
   */
  public async removeFriend(playerId: string, friendToRemoveId: string): Promise<void> {
      console.log(`SocialApiClient: Player ${playerId} removing friend ${friendToRemoveId}.`);
      await this.apiClient.callApi(`/social/friends?playerId=${playerId}`, { friendToRemoveId, action: 'remove_friend'}, 'DELETE');
  }


  // --- Chat Methods ---

  /**
   * Fetches chat messages for a specific channel or private conversation.
   * @param channelId Optional. The ID of the public/group channel.
   * @param recipientId Optional. The ID of the other user in a private chat (used with playerId).
   * @param playerId Optional. The ID of the current player (for private chats).
   * @returns A promise that resolves with an array of chat messages.
   */
  public async getChatMessages(params: { channelId?: string, recipientId?: string, playerId?: string, limit?: number, beforeTimestamp?: string }): Promise<ChatMessage[]> {
    const queryParams = new URLSearchParams();
    if (params.channelId) queryParams.append('channelId', params.channelId);
    if (params.recipientId) queryParams.append('recipientId', params.recipientId);
    if (params.playerId) queryParams.append('playerId', params.playerId); // For context if fetching private messages
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.beforeTimestamp) queryParams.append('beforeTimestamp', params.beforeTimestamp);
    
    const queryString = queryParams.toString();
    console.log(`SocialApiClient: Fetching chat messages with params: ${queryString}`);
    return this.apiClient.callApi<ChatMessage[]>(`/social/chat?${queryString}`, undefined, 'GET');
  }

  /**
   * Sends a chat message.
   * @param senderPlayerId The ID of the player sending the message.
   * @param senderName The display name of the sender.
   * @param content The text content of the message.
   * @param channelId Optional. The ID of the channel to send to (for public/group chat).
   * @param receiverId Optional. The ID of the recipient player (for private messages).
   * @returns A promise that resolves with the sent message data.
   */
  public async sendChatMessage(payload: { senderPlayerId: string, senderName: string, content: string, channelId?: string, receiverId?: string }): Promise<ChatMessage> {
    console.log(`SocialApiClient: Player ${payload.senderPlayerId} sending chat message: "${payload.content}"`);
    // The API might infer senderPlayerId from session if available server-side
    return this.apiClient.callApi<ChatMessage>(`/social/chat`, payload, 'POST');
  }
}

console.log("SocialApiClient class (src/game-client/api-client/social.ts) created.");
