// src/game-client/api-client/protocolFork.ts
/**
 * ProtocolForkApiClient provides methods for interacting with the Protocol Fork system,
 * allowing players to submit proposals for game rule changes and vote on them.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define ProtocolForkProposal type, ideally from @packages/common-types
// For now, using 'any' as placeholder.
type ProtocolForkProposal = any; 
interface ProposalVote {
  proposalId: string;
  vote: 'agree' | 'disagree' | 'abstain'; // Abstain might be an option
  playerId: string; // To record who voted
  reasoning?: string; // Optional justification for the vote
}

export class ProtocolForkApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Submits a new Protocol Fork proposal.
   * @param playerId The ID of the player submitting the proposal.
   * @param proposal The ProtocolForkProposal object.
   * @returns A promise that resolves when the proposal is successfully submitted.
   */
  public async submitProposal(playerId: string, proposal: ProtocolForkProposal): Promise<any> {
    console.log(`ProtocolForkApiClient: Player ${playerId} submitting proposal:`, proposal);
    // The backend API, e.g., `/api/protocol-fork/submit`, would handle this.
    return this.apiClient.callApi('/protocol-fork/submit', { playerId, proposal }, 'POST');
  }

  /**
   * Submits a vote on an existing Protocol Fork proposal.
   * @param voteData An object containing proposalId, player's vote, and optional reasoning.
   * @returns A promise that resolves when the vote is successfully recorded.
   */
  public async voteOnProposal(voteData: ProposalVote): Promise<void> {
    console.log(`ProtocolForkApiClient: Player ${voteData.playerId} voting ${voteData.vote} on proposal ${voteData.proposalId}.`);
    // The backend API, e.g., `/api/protocol-fork/vote`, would handle this.
    await this.apiClient.callApi('/protocol-fork/vote', voteData, 'POST');
  }

  /**
   * Fetches all active or recent Protocol Fork proposals.
   * @returns A promise that resolves with an array of proposals.
   */
  public async getProposals(): Promise<ProtocolForkProposal[]> {
    console.log("ProtocolForkApiClient: Fetching protocol fork proposals.");
    return this.apiClient.callApi<ProtocolForkProposal[]>('/protocol-fork/proposals', undefined, 'GET');
  }

  // Add other methods if needed, e.g.,
  // - Get details of a specific proposal
  // - Get player's voting history
}

console.log("ProtocolForkApiClient class (src/game-client/api-client/protocolFork.ts) created.");
