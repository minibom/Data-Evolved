// src/game-client/api-client/social.ts
import { apiClient } from './index';

// Define interfaces for Social API responses if not already in common-types
// For example:
// interface FriendList { friends: any[]; pending: any[]; }
// interface ChatMessage { id: string; sender: string; text: string; timestamp: string; }

export async function getFriendsList(playerId: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/social/friends?playerId=${playerId}`);
}

export async function sendFriendRequest(senderPlayerId: string, targetPlayerId: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/social/friends?senderPlayerId=${senderPlayerId}`, {
    method: 'POST',
    body: JSON.stringify({ targetPlayerId }),
  });
}

export async function respondToFriendRequest(playerId: string, requestPlayerId: string, status: 'accept' | 'decline'): Promise<any> { // Replace 'any'
    return apiClient.fetchApi<any>(`/social/friends?playerId=${playerId}`, {
        method: 'PATCH',
        body: JSON.stringify({ requestPlayerId, status })
    });
}

export async function getChatMessages(channelId?: string, privateChatUserId?: string): Promise<any[]> { // Replace 'any'
  let query = '/social/chat?';
  if (channelId) query += `channelId=${channelId}`;
  // if (privateChatUserId) query += `&userId=${privateChatUserId}`; // Adjust based on API
  return apiClient.fetchApi<any[]>(query);
}

export async function sendChatMessage(senderPlayerId: string, senderName: string, content: string, channelId?: string, receiverId?: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/social/chat?senderPlayerId=${senderPlayerId}&senderName=${encodeURIComponent(senderName)}`, {
    method: 'POST',
    body: JSON.stringify({ content, channelId, receiverId }),
  });
}

console.log("Game Client Social API functions (src/game-client/api-client/social.ts) loaded.");
