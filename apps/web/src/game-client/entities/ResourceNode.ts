// src/game-client/entities/ResourceNode.ts
import { WorldObject } from './WorldObject';
import type { GameClient } from '../index';
// import type { ItemData } from '@packages/common-types/game'; // Static item definition

interface ResourceNodeData {
  name: string;
  resourceId: string; // e.g., "data_scrap_common", "crystal_shard_rare"
  resourceName: string; // Display name of the resource
  maxYield: number;
  currentYield: number;
  respawnTimeMs: number; // Time in milliseconds to respawn after depletion
  toolRequired?: string; // e.g., "mining_laser", "data_extractor"
  visualKey?: string; // For sprite/model
}

export class ResourceNode extends WorldObject {
  private nodeData: ResourceNodeData;
  private lastHarvestTime: number = 0;
  private isDepleted: boolean = false;

  constructor(game: GameClient, x: number, y: number, data: ResourceNodeData) {
    super(game, x, y, data.name, 'ResourceNode');
    this.nodeData = { ...data }; // Copy data
    this.isInteractive = true; // Resource nodes are typically interactive
    this.nodeData.currentYield = data.maxYield; // Start full
    console.log(`ResourceNode "${this.nodeData.name}" (Resource: ${this.nodeData.resourceId}) initialized with ${this.nodeData.currentYield} yield.`);
  }

  public update(delta: number): void {
    super.update(delta);
    if (this.isDepleted && Date.now() > this.lastHarvestTime + this.nodeData.respawnTimeMs) {
      this.respawn();
    }
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    // Placeholder rendering - use sprite based on visualKey or resourceId
    if (this.isDepleted) {
      renderer.fillStyle = 'grey';
    } else {
      renderer.fillStyle = this.nodeData.resourceId.includes("rare") ? 'gold' : 'cyan';
    }
    renderer.beginPath();
    // Simple representation (e.g., a rock or crystal shape)
    renderer.moveTo(this.x - 10, this.y + 10);
    renderer.lineTo(this.x, this.y - 10);
    renderer.lineTo(this.x + 10, this.y + 10);
    renderer.closePath();
    renderer.fill();

    if (!this.isDepleted) {
        renderer.fillStyle = 'black';
        renderer.font = '8px Arial';
        renderer.textAlign = 'center';
        renderer.fillText(this.nodeData.resourceName.substring(0,3), this.x, this.y + 5);
        renderer.textAlign = 'left';
    }
  }

  public interact(interactor: any /* Player */): any {
    if (this.isDepleted) {
      console.log(`${this.nodeData.name} is depleted. Respawning soon.`);
      // this.game.uiManager.showToast(`${this.nodeData.name} is depleted.`, "info");
      return { success: false, message: "Node depleted." };
    }

    if (this.nodeData.toolRequired /* && !interactor.hasTool(this.nodeData.toolRequired) */) {
      console.log(`Tool "${this.nodeData.toolRequired}" required to harvest ${this.nodeData.name}.`);
      // this.game.uiManager.showToast(`Requires ${this.nodeData.toolRequired}.`, "warning");
      return { success: false, message: `Requires ${this.nodeData.toolRequired}.` };
    }

    // Simulate harvesting one unit
    const harvestedAmount = 1; // Could be variable based on player skill/tool
    this.nodeData.currentYield -= harvestedAmount;
    
    console.log(`${interactor.name} harvested ${harvestedAmount}x ${this.nodeData.resourceName} from ${this.nodeData.name}. Remaining: ${this.nodeData.currentYield}`);
    // this.game.inventorySystem.addItem(interactor.id, this.nodeData.resourceId, harvestedAmount); // Add to player inv

    if (this.nodeData.currentYield <= 0) {
      this.deplete();
    }
    return { success: true, itemGained: this.nodeData.resourceId, quantity: harvestedAmount };
  }

  private deplete(): void {
    this.isDepleted = true;
    this.lastHarvestTime = Date.now();
    this.nodeData.currentYield = 0;
    console.log(`${this.nodeData.name} has been depleted.`);
    // Change visual state (e.g., dimmer sprite, rubble)
  }

  private respawn(): void {
    this.isDepleted = false;
    this.nodeData.currentYield = this.nodeData.maxYield;
    console.log(`${this.nodeData.name} has respawned with ${this.nodeData.currentYield} yield.`);
    // Reset visual state
  }

  public getInteractionPrompt(): string {
    if (this.isDepleted) return `${this.nodeData.name} (Depleted)`;
    return `Harvest ${this.nodeData.name}`;
  }

  public canInteract(interactor: any): boolean {
    return !this.isDepleted; // Can only interact if not depleted (basic check)
  }
}

console.log("ResourceNode class (src/game-client/entities/ResourceNode.ts) created.");
