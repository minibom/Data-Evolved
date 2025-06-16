// src/game-client/systems/InventorySystem.ts
// This system would manage player inventories on the client-side,
// synchronizing with the server via API calls.
// import type { ItemInstance, Item } from '@packages/common-types/game';
// import { apiClient } from '../api-client'; // For server sync

interface ItemInstanceClient extends Partial<any> { // Replace 'any' with actual ItemInstance from common-types
    instanceId: string;
    itemId: string;
    quantity: number;
    // Client-specific properties, e.g., reference to item definition
    definition?: any; // Replace 'any' with actual Item from common-types
}

export class InventorySystem {
  private playerInventories: Map<string, ItemInstanceClient[]> = new Map(); // playerId -> inventory

  constructor() {
    console.log("InventorySystem initialized.");
  }

  public async loadInventory(playerId: string): Promise<void> {
    console.log(`Loading inventory for player ${playerId}...`);
    // const items = await apiClient.getPlayerInventory(playerId); // Assuming API exists
    // For now, mock:
    const items: ItemInstanceClient[] = [
        { instanceId: "mock_scrap_1", itemId: "data_scrap_common", quantity: 100, definition: { name: "Common Data Scrap", icon: "Cpu"} },
        { instanceId: "mock_stim_1", itemId: "health_stim_module_mk1", quantity: 5, definition: { name: "Health Stim Mk1", icon: "HeartPulse"} },
    ];
    this.playerInventories.set(playerId, items);
    console.log(`Inventory for player ${playerId} loaded:`, items);
  }

  public getInventory(playerId: string): ItemInstanceClient[] {
    return this.playerInventories.get(playerId) || [];
  }

  public async addItem(playerId: string, itemId: string, quantity: number = 1): Promise<boolean> {
    console.log(`Attempting to add ${quantity} of ${itemId} to player ${playerId}'s inventory.`);
    // 1. Optimistically update client-side inventory
    // 2. Call API to persist change
    // 3. Handle API response (confirm or revert optimistic update)
    // This is a simplified version:
    const inventory = this.getInventory(playerId);
    const existingItem = inventory.find(item => item.itemId === itemId && item.definition?.stackable); // Assuming definition has stackable
    
    // const success = await apiClient.addItemToInventory(playerId, itemId, quantity);
    // if (success) {
        if (existingItem && existingItem.definition?.stackable) {
            existingItem.quantity += quantity;
        } else {
            // Fetch item definition if not already cached
            // const itemDef = await this.getItemDefinition(itemId);
            inventory.push({ instanceId: `new_${Date.now()}`, itemId, quantity, definition: { name: `Item ${itemId}` } });
        }
        this.playerInventories.set(playerId, [...inventory]); // Ensure re-render if React based UI
        console.log("Item added (client-side). Server sync needed.");
        return true;
    // }
    // return false;
  }

  public async removeItem(playerId: string, instanceId: string, quantity: number = 1): Promise<boolean> {
    console.log(`Attempting to remove ${quantity} of item (instance: ${instanceId}) from player ${playerId}.`);
    // Similar logic to addItem: optimistic update, API call, handle response
    const inventory = this.getInventory(playerId);
    const itemIndex = inventory.findIndex(item => item.instanceId === instanceId);

    if (itemIndex > -1) {
        // const success = await apiClient.removeItemFromInventory(playerId, instanceId, quantity);
        // if(success) {
            const item = inventory[itemIndex];
            if (item.quantity > quantity) {
                item.quantity -= quantity;
            } else {
                inventory.splice(itemIndex, 1);
            }
            this.playerInventories.set(playerId, [...inventory]);
            console.log("Item removed (client-side). Server sync needed.");
            return true;
        // }
    }
    // return false;
  }

  // Helper to get full item definition (from data/items.json or a cache)
  // private async getItemDefinition(itemId: string): Promise<Item | null> { /* ... */ }
}

console.log("InventorySystem class (src/game-client/systems/InventorySystem.ts) loaded.");
