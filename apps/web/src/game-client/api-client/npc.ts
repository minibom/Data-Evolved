// src/game-client/api-client/npc.ts
import type { ApiClient } from './index';
// Define DialogueContext and DialogueResponse types, ideally from @packages/common-types
type DialogueContext = any; // Placeholder
type DialogueResponse = any; // Placeholder

export class NpcApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async interact(npcId: string, dialogueContext: DialogueContext): Promise<DialogueResponse> {
    console.log(`NpcApiClient: Interacting with NPC ${npcId}.`, dialogueContext);
    // Assuming an API endpoint like /api/npc/interact or similar
    return this.apiClient.callApi<DialogueResponse>(`/npc/${npcId}/interact`, dialogueContext, 'POST');
  }
}

console.log("NpcApiClient class (src/game-client/api-client/npc.ts) loaded.");
