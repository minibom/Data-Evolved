// src/game-client/systems/ProtocolForkSystem.ts
import { BaseSystem } from './BaseSystem';
import type { GameClient } from '../index';
// Define CodeFragment, ProtocolForkProposal types, ideally from @packages/common-types
type CodeFragment = any; // Placeholder
type ProtocolForkProposal = any; // Placeholder

export class ProtocolForkSystem extends BaseSystem {
  private collectedFragments: CodeFragment[] = [];
  private activeProposals: ProtocolForkProposal[] = [];

  constructor(game: GameClient) {
    super(game);
  }

  public init(): void {
    super.init();
    // Fetch active proposals, player's collected fragments
  }

  public update(delta: number): void {
    // Handle UI updates for proposals, voting timers
  }

  public collectCodeFragment(fragment: CodeFragment): void {
    this.collectedFragments.push(fragment);
    console.log(`ProtocolForkSystem: Collected code fragment ${fragment.id}.`);
    // Update UI
  }

  public showProposalUI(): void {
    console.log("ProtocolForkSystem: Showing proposal UI.");
    // This would likely trigger a scene change to CompilerTerminalScene or open a modal UI.
    // this.game.loadScene(new CompilerTerminalScene(this.game, this.collectedFragments));
  }

  public async voteForProposal(proposalId: string): Promise<void> {
    console.log(`ProtocolForkSystem: Voting for proposal ${proposalId}.`);
    // const playerId = this.game.getCurrentPlayerId();
    // try {
    //   await this.game.getApiClient().protocolFork.voteOnProposal(proposalId, 'agree'); // or 'disagree'
    //   console.log("Vote submitted successfully.");
    //   // Update UI or fetch updated proposal status
    // } catch (error) {
    //   console.error("Failed to vote on proposal:", error);
    // }
  }

  public updateProposals(proposals: ProtocolForkProposal[]): void {
    this.activeProposals = proposals;
    console.log("ProtocolForkSystem: Active proposals updated.", proposals);
    // Update UI displaying proposals and voting options
  }
}

console.log("ProtocolForkSystem class (src/game-client/systems/ProtocolForkSystem.ts) created.");
