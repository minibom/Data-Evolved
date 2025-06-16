// src/game-client/api-client/npc.ts
/**
 * NpcApiClient provides methods for interacting with NPC-related backend APIs,
 * such as initiating dialogue or triggering NPC-specific actions.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define DialogueContext and DialogueResponse types, ideally from @packages/common-types
// or src/flows/npcDialogue.ts if specific to that flow.
// For now, using 'any' as placeholder.
type DialogueContext = any; 
type DialogueResponse = any;

export class NpcApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Initiates an interaction or sends dialogue context to an NPC.
   * @param npcId The unique identifier of the NPC to interact with.
   * @param dialogueContext An object containing relevant player and world state for the NPC's response.
   * @returns A promise that resolves with the NPC's dialogue response.
   */
  public async interact(npcId: string, dialogueContext: DialogueContext): Promise<DialogueResponse> {
    console.log(`NpcApiClient: Interacting with NPC ${npcId}. Context:`, dialogueContext);
    // The backend API, e.g., `/api/npc-interactions`, would handle this,
    // potentially calling the `npcDialogue` Genkit flow.
    // The request might be POST /api/npc-interactions or POST /api/npc/{npcId}/interact
    return this.apiClient.callApi<DialogueResponse>(`/npc-interactions`, { npcId, ...dialogueContext }, 'POST');
    // Or if endpoint is /api/npc/{npcId}/interact
    // return this.apiClient.callApi<DialogueResponse>(`/npc/${npcId}/interact`, dialogueContext, 'POST');
  }

  // Add other NPC-related API calls if needed, e.g.,
  // - Get NPC quest status for player
  // - Trigger specific NPC behaviors
}

console.log("NpcApiClient class (src/game-client/api-client/npc.ts) created.");
