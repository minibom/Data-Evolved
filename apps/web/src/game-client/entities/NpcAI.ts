// src/game-client/entities/NpcAI.ts
import { Entity } from './Entity';
import type { GameClient } from '../index';
import type { Player } from './Player'; // For interaction

// Placeholder types - should come from @packages/common-types
type NpcData = { name?: string, initialStats?: any, personality?: string, dialogueTreeId?: string };
type DialogueTree = any;
type NpcMemory = any; // Could store past interactions, player reputation with this NPC
type DialogueResponse = any;

export class NpcAI extends Entity {
  public dialogueTreeId: string | null; // ID to fetch the actual dialogue tree
  public dialogueTree: DialogueTree | null = null; // Actual loaded dialogue tree
  public memory: NpcMemory = {}; // NPC's memory about interactions
  public personality: string;
  private interactionRadius: number = 100; // Pixels

  constructor(game: GameClient, x: number, y: number, data: NpcData) {
    super(game, x, y, data.name || "NPC", data.initialStats);
    this.personality = data.personality || "neutral";
    this.dialogueTreeId = data.dialogueTreeId || null;
    // Load dialogueTree based on dialogueTreeId from AssetManager or API
    // this.loadDialogueTree(); 
    console.log(`NpcAI "${this.name}" (ID: ${this.id}) initialized with personality: ${this.personality}.`);
  }

  // private async loadDialogueTree(): Promise<void> {
  //   if (this.dialogueTreeId) {
  //     // this.dialogueTree = await this.game.getAssetManager().getAsset(this.dialogueTreeId);
  //     console.log(`Dialogue tree ${this.dialogueTreeId} loaded for NPC ${this.name}.`);
  //   }
  // }

  public update(delta: number): void {
    if (!this.isAlive()) return;
    // NPC logic: pathfinding (if mobile), responding to player proximity, scripted events
    // Example: Check if player is nearby to indicate interaction possibility
    // const player = this.game.player; // Assuming game client has a reference to the player
    // if (player) {
    //   const distanceToPlayer = Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
    //   if (distanceToPlayer < this.interactionRadius) {
    //     // Potentially trigger an interaction prompt on UI
    //   }
    // }
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isAlive() && this.sprite) { /* Render differently if dead */ }

    if (this.sprite) {
      // renderer.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      renderer.fillStyle = 'cyan'; // NPC color
      renderer.fillRect(this.x - 16, this.y - 24, 32, 48); // Example size
      renderer.fillStyle = 'black';
      renderer.font = '10px Arial';
      renderer.textAlign = 'center';
      renderer.fillText(this.name.substring(0, 8), this.x, this.y - 30);
      renderer.textAlign = 'left'; // Reset
    }
  }

  public async interact(player: Player): Promise<DialogueResponse> {
    console.log(`Player ${player.name} interacted with NPC "${this.name}".`);
    // Trigger dialogue, open shop UI, assign quest, etc.
    // Example:
    // const dialogueContext = { playerId: player.id, npcMemory: this.memory, playerFaction: player.faction };
    // const response = await this.game.getApiClient().npc.interact(this.id, dialogueContext);
    // this.memory = response.updatedNpcMemory || this.memory; // Update NPC memory
    // this.game.getSystem(NpcInteractionSystem).handleDialogueResponse(response);
    // return response;
    return { nextLine: "Greetings, Data Entity.", options: ["Ask about Nexus", "Goodbye"] }; // Placeholder
  }

  protected onDeath(): void {
    super.onDeath();
    console.log(`NPC ${this.name} has been deactivated.`);
    // NPCs might not "die" in the same way as enemies, maybe they just become non-interactive or respawn.
  }
}

console.log("NpcAI class (src/game-client/entities/NpcAI.ts) updated.");
