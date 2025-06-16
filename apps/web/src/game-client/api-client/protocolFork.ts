// src/game-client/api-client/protocolFork.ts
import type { ApiClient } from './index';
// Define ProtocolForkProposal type, ideally from @packages/common-types
type ProtocolForkProposal = any; // Placeholder

export class ProtocolForkApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async submitProposal(proposal: ProtocolForkProposal): Promise<void> {
    console.log("ProtocolForkApiClient: Submitting proposal.", proposal);
    // Assuming an API endpoint like /api/protocol-fork/submit
    await this.apiClient.callApi('/protocol-fork/submit', { proposal }, 'POST');
  }

  public async voteOnProposal(proposalId: string, vote: 'agree' | 'disagree'): Promise<void> {
    console.log(`ProtocolForkApiClient: Voting ${vote} on proposal ${proposalId}.`);
    // Assuming an API endpoint like /api/protocol-fork/vote
    await this.apiClient.callApi('/protocol-fork/vote', { proposalId, vote }, 'POST');
  }
}

console.log("ProtocolForkApiClient class (src/game-client/api-client/protocolFork.ts) loaded.");
