// src/game-client/entities/Item.ts
import { BaseObject } from './BaseObject';
import type { GameClient } from '../index';
import type { Item as ItemData } from '@packages/common-types/game'; // Game data definition

// This class represents an item instance in the game world (e.g., a dropped item).
// It's different from ItemData which is the static definition of an item type.
export class WorldItem extends BaseObject {
  public itemDataId: string; // ID from items.json or similar
  public itemName: string;
  public quantity: number;

  constructor(gameClient: GameClient, x: number, y: number, itemDefinition: ItemData, quantity: number = 1) {
    super(gameClient, x, y, 24, 24); // Smaller size for world items
    this.type = "WorldItem";
    this.itemDataId = itemDefinition.id;
    this.itemName = itemDefinition.name;
    this.quantity = quantity;
    // Load sprite based on itemDefinition.icon
    console.log(`WorldItem "${this.itemName}" (ID: ${this.id}, DataID: ${this.itemDataId}) created at (${x}, ${y}).`);
  }

  public update(deltaTime: number): void {
    super.update(deltaTime);
    // Logic for items in the world, e.g., despawn timer, bobbing animation
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    // Example rendering - replace with sprite
    renderer.fillStyle = 'gold'; // Item color
    renderer.beginPath();
    renderer.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
    renderer.fill();
    renderer.fillStyle = 'black';
    renderer.font = '8px Arial';
    renderer.textAlign = 'center';
    renderer.fillText(this.itemName.substring(0,3), this.x + this.width / 2, this.y + this.height / 1.5);
    renderer.textAlign = 'left'; // Reset
  }

  public onPickup(/* byPlayer: Player */): void {
    console.log(`Item "${this.itemName}" (ID: ${this.id}) picked up.`);
    // Add to player's inventory, then destroy this world object
    // this.gameClient.getInventorySystem().addItem(byPlayer.id, this.itemDataId, this.quantity);
    this.destroy(); // Mark for removal from the game world
  }
}

console.log("WorldItem class (src/game-client/entities/Item.ts) loaded.");
