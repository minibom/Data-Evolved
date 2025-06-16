// src/game-client/api-client/inventory.ts
/**
 * InventoryApiClient provides methods for interacting with player inventory APIs.
 * This includes fetching inventory, adding/removing items, and using items.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define ItemInstance type, ideally from @packages/common-types/game
// For now, using 'any' as placeholder.
type ItemInstance = any; 

export class InventoryApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches the inventory for a specific player.
   * @param playerId The ID of the player whose inventory is to be fetched.
   * @returns A promise that resolves with an array of item instances in the player's inventory.
   */
  public async getPlayerInventory(playerId: string): Promise<ItemInstance[]> {
    console.log(`InventoryApiClient: Fetching inventory for player ${playerId}.`);
    return this.apiClient.callApi<ItemInstance[]>(`/inventory?playerId=${playerId}`, undefined, 'GET');
  }

  /**
   * Adds an item to a player's inventory.
   * Server should handle stacking logic if applicable.
   * @param playerId The ID of the player.
   * @param itemId The ID of the item definition to add.
   * @param quantity The quantity of the item to add.
   * @returns A promise that resolves with the updated inventory or the added item instance.
   */
  public async addItemToInventory(playerId: string, itemId: string, quantity: number = 1): Promise<any> {
    console.log(`InventoryApiClient: Player ${playerId} adding ${quantity}x ${itemId} to inventory.`);
    return this.apiClient.callApi<any>(`/inventory?playerId=${playerId}`, { action: 'add', itemId, quantity }, 'POST');
  }

  /**
   * Removes an item (or a quantity of an item) from a player's inventory.
   * @param playerId The ID of the player.
   * @param itemInstanceId The unique instance ID of the item stack to remove from.
   *                       Alternatively, could be itemId if server handles finding the stack.
   * @param quantity The quantity to remove.
   * @returns A promise that resolves on successful removal.
   */
  public async removeItemFromInventory(playerId: string, itemInstanceId: string, quantity: number = 1): Promise<void> {
    console.log(`InventoryApiClient: Player ${playerId} removing ${quantity}x item (instance ${itemInstanceId}) from inventory.`);
    await this.apiClient.callApi(`/inventory?playerId=${playerId}`, { action: 'remove', itemInstanceId, quantity }, 'POST'); // Could be DELETE
  }

  /**
   * Uses a consumable item from the player's inventory.
   * The server will apply the item's effects and remove it from inventory.
   * @param playerId The ID of the player.
   * @param itemInstanceId The instance ID of the item to use.
   * @returns A promise that resolves with the outcome of using the item (e.g., effects applied).
   */
  public async useItem(playerId: string, itemInstanceId: string): Promise<any> {
    console.log(`InventoryApiClient: Player ${playerId} using item (instance ${itemInstanceId}).`);
    return this.apiClient.callApi<any>(`/inventory?playerId=${playerId}`, { action: 'use', itemInstanceId }, 'POST');
  }

  /**
   * Equips an item from the inventory to the player's equipment slots.
   * @param playerId The ID of the player.
   * @param itemInstanceId The instance ID of the item to equip.
   * @param slot The equipment slot to equip the item to (e.g., 'weapon', 'core_module').
   * @returns A promise that resolves with the player's updated equipment status.
   */
  public async equipItem(playerId: string, itemInstanceId: string, slot: string): Promise<any> {
    console.log(`InventoryApiClient: Player ${playerId} equipping item ${itemInstanceId} to slot ${slot}.`);
    return this.apiClient.callApi<any>(`/inventory?playerId=${playerId}`, { action: 'equip', itemInstanceId, slot }, 'POST');
  }

  /**
   * Unequips an item from the player's equipment slots back to inventory.
   * @param playerId The ID of the player.
   * @param slot The equipment slot from which to unequip the item.
   * @returns A promise that resolves with the player's updated inventory/equipment status.
   */
  public async unequipItem(playerId: string, slot: string): Promise<any> {
      console.log(`InventoryApiClient: Player ${playerId} unequipping item from slot ${slot}.`);
      return this.apiClient.callApi<any>(`/inventory?playerId=${playerId}`, { action: 'unequip', slot }, 'POST');
  }
}

console.log("InventoryApiClient class (src/game-client/api-client/inventory.ts) created.");
