// src/game-client/systems/NpcInteractionSystem.ts
import { BaseSystem } from './BaseSystem';
import type { GameClient } from '../index';
import type { NpcAI } from '../entities/NpcAI';
// Define DialogueResponse type, ideally from @packages/common-types
type DialogueResponse = any; // Placeholder

export class NpcInteractionSystem extends BaseSystem {
  private activeDialogueTarget: NpcAI | null = null;

  constructor(game: GameClient) {
    super(game);
  }

  public init(): void {
    super.init();
  }

  public update(delta: number): void {
    // Handle interactions like checking if player is near an NPC to show an interaction prompt
  }

  public async initiateDialogue(npcId: string): Promise<void> {
    const npc = this.game.entityManager?.getEntityById(npcId) as NpcAI; // Assuming an entity manager
    if (!npc || !(npc instanceof NpcAI)) {
      console.warn(`NpcInteractionSystem: NPC with ID ${npcId} not found or not an NpcAI.`);
      return;
    }
    this.activeDialogueTarget = npc;
    console.log(`NpcInteractionSystem: Initiating dialogue with ${npc.name}.`);
    
    // Example: Fetch initial dialogue line
    // const playerContext = this.game.getPlayerContext(); // Method to get relevant player data
    // const initialResponse = await npc.interact(this.game.getPlayer(), playerContext); // Player and context
    // this.handleDialogueResponse(initialResponse);
    
    // Placeholder for showing UI
    // this.game.uiManager.showDialogue(npc.name, "Greetings, traveler!", [{text: "Hello", onSelect: () => this.selectOption("hello_response")}]);
  }

  public handleDialogueResponse(response: DialogueResponse): void {
    if (!this.activeDialogueTarget) return;

    console.log(`NpcInteractionSystem: Received dialogue response from ${this.activeDialogueTarget.name}:`, response);
    // Update dialogue UI with the new line and options
    // this.game.uiManager.showDialogue(this.activeDialogueTarget.name, response.line, response.options.map(opt => ({
    //   text: opt.text,
    //   onSelect: () => this.selectDialogueOption(this.activeDialogueTarget.id, opt.id)
    // })));
  }
  
  // private async selectDialogueOption(npcId: string, optionId: string): Promise<void> {
  //   const npc = this.activeDialogueTarget;
  //   if(npc && npc.id === npcId) {
  //      const playerContext = this.game.getPlayerContext();
  //      const nextResponse = await this.game.getApiClient().npc.selectDialogueOption(npcId, optionId, playerContext);
  //      this.handleDialogueResponse(nextResponse);
  //   }
  // }

  public endDialogue(): void {
    if (this.activeDialogueTarget) {
      console.log(`NpcInteractionSystem: Ending dialogue with ${this.activeDialogueTarget.name}.`);
      this.activeDialogueTarget = null;
      // this.game.uiManager.hideDialogue();
    }
  }
}

console.log("NpcInteractionSystem class (src/game-client/systems/NpcInteractionSystem.ts) created.");
