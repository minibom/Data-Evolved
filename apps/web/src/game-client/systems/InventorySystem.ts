// src/game-client/systems/InventorySystem.ts
import { BaseSystem } from './BaseSystem';
import type { GameClient } from '../index';
import type { Item } from '../entities/Item'; // Assuming Item entity

export class InventorySystem extends BaseSystem {
  private playerInventories: Map<string, Item[]> = new Map(); // playerId -> Item[]

  constructor(game: GameClient) {
    super(game);
  }

  public init(): void {
    super.init();
    // Load initial inventories if needed, or wait for player login
  }

  public update(delta: number): void {
    // Could handle timed effects of items in inventory, though unlikely
  }

  public addItem(playerId: string, item: Item): void {
    const inventory = this.playerInventories.get(playerId) || [];
    // Handle stacking if item is stackable and already exists
    const existingItem = inventory.find(i => i.itemId === item.itemId /* && i.isStackable */);
    if (existingItem /* && existingItem.isStackable */) {
      // existingItem.quantity += item.quantity;
    } else {
      inventory.push(item);
    }
    this.playerInventories.set(playerId, inventory);
    console.log(`Item ${item.name} added to inventory of player ${playerId}.`);
    // Notify UI to update
  }

  public removeItem(playerId: string, item: Item, quantityToRemove: number = 1): void {
    const inventory = this.playerInventories.get(playerId);
    if (!inventory) return;

    const itemIndex = inventory.findIndex(i => i.id === item.id); // Assuming item instance ID
    if (itemIndex > -1) {
      // inventory[itemIndex].quantity -= quantityToRemove;
      // if (inventory[itemIndex].quantity <= 0) {
      //   inventory.splice(itemIndex, 1);
      // }
      console.log(`Item ${item.name} (qty: ${quantityToRemove}) removed from inventory of player ${playerId}.`);
      // Notify UI
    }
  }

  public useItem(playerId: string, item: Item): void {
    console.log(`Player ${playerId} is using item: ${item.name}`);
    // Apply item effects, then potentially remove/reduce quantity
    // e.g., if (item.type === 'Consumable') this.applyConsumableEffect(playerId, item);
    // this.removeItem(playerId, item, 1);
  }

  public getPlayerInventory(playerId: string): Item[] {
    return this.playerInventories.get(playerId) || [];
  }
}

console.log("InventorySystem class (src/game-client/systems/InventorySystem.ts) updated.");
