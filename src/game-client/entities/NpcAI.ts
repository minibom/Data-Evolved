// src/game-client/entities/NpcAI.ts
import { BaseObject } from './BaseObject';
import type { GameClient } from '../index';

export class NpcAI extends BaseObject {
  public npcId: string; // Corresponds to an NPC definition (e.g., from a JSON file or DB)
  public personality: string;
  public dialogueTree: any; // Placeholder for dialogue structure
  private interactionRadius: number = 100; // Pixels

  constructor(gameClient: GameClient, x: number, y: number, npcId: string, personality: string = "neutral") {
    super(gameClient, x, y, 32, 48); // Example dimensions
    this.type = "NPC";
    this.npcId = npcId;
    this.personality = personality;
    // Load NPC specific data (sprite, dialogue, quests) based on npcId
    console.log(`NPC "${npcId}" (ID: ${this.id}) initialized.`);
  }

  public update(deltaTime: number /*, player: Player */): void {
    super.update(deltaTime);
    // NPC logic: pathfinding, responding to player proximity, scripted events
    // Example: Check if player is nearby to initiate dialogue
    // const distanceToPlayer = Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
    // if (distanceToPlayer < this.interactionRadius) {
    //   // Potentially trigger dialogue UI or an interaction prompt
    // }
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    // Example rendering
    renderer.fillStyle = 'gray'; // NPC color
    renderer.fillRect(this.x, this.y, this.width, this.height);
    renderer.fillStyle = 'white';
    renderer.font = '10px Arial';
    renderer.fillText(this.npcId.substring(0,6), this.x + 2, this.y + 10);
    // Render NPC sprite, interaction indicators, etc.
  }

  public interact(/* player: Player */): void {
    console.log(`Player interacted with NPC "${this.npcId}".`);
    // Trigger dialogue, open shop UI, assign quest, etc.
    // Example: this.gameClient.getDialogueManager().startDialogue(this.dialogueTree, this);
  }
}

console.log("NpcAI class (src/game-client/entities/NpcAI.ts) loaded.");
