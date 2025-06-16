// src/game-client/api-client/shop.ts
/**
 * ShopApiClient provides methods for interacting with in-game shops,
 * allowing players to view items and make purchases.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define ShopItem type, ideally from @packages/common-types/shop
// For now, using 'any' as placeholder.
type ShopItem = any; 

export class ShopApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches the list of items available in a specific shop or all shops.
   * @param shopId Optional. The ID of a specific shop to fetch items from.
   *               If not provided, might return items from a general or player-accessible shop.
   * @returns A promise that resolves with an array of shop items.
   */
  public async getShopItems(shopId?: string): Promise<ShopItem[]> {
    let endpoint = '/shop';
    if (shopId) {
      endpoint += `?shopId=${shopId}`;
    }
    console.log(`ShopApiClient: Fetching shop items${shopId ? ` for shop ${shopId}` : ''}.`);
    return this.apiClient.callApi<ShopItem[]>(endpoint, undefined, 'GET');
  }

  /**
   * Attempts to purchase an item from a shop.
   * The server will validate if the player has enough currency and if the item is in stock.
   * @param playerId The ID of the player making the purchase.
   * @param itemId The ID of the item to purchase.
   * @param quantity The quantity of the item to purchase.
   * @param shopId Optional. The ID of the shop from which to purchase, if relevant.
   * @returns A promise that resolves with the transaction details or success status.
   */
  public async purchaseItem(playerId: string, itemId: string, quantity: number, shopId?: string): Promise<any> {
    console.log(`ShopApiClient: Player ${playerId} purchasing ${quantity}x ${itemId}${shopId ? ` from shop ${shopId}` : ''}.`);
    // The API endpoint might vary, e.g., POST /shop/purchase or POST /shop with action in body
    const payload: any = { playerId, itemId, quantity };
    if (shopId) payload.shopId = shopId;
    
    return this.apiClient.callApi<any>(`/shop`, payload, 'POST'); // Assuming a general /shop POST for actions
  }

  /**
   * Sells an item from the player's inventory to a shop.
   * @param playerId The ID of the player selling the item.
   * @param itemInstanceId The unique instance ID of the item in the player's inventory.
   * @param quantity The quantity to sell.
   * @param shopId Optional. The ID of the shop to sell to, if relevant.
   * @returns A promise that resolves with transaction details or success status.
   */
  public async sellItem(playerId: string, itemInstanceId: string, quantity: number, shopId?: string): Promise<any> {
      console.log(`ShopApiClient: Player ${playerId} selling ${quantity}x item (instance ${itemInstanceId})${shopId ? ` to shop ${shopId}` : ''}.`);
      const payload: any = { playerId, itemInstanceId, quantity, action: 'sell' };
      if (shopId) payload.shopId = shopId;
      
      return this.apiClient.callApi<any>(`/shop`, payload, 'POST'); // Assuming same endpoint, action distinguishes
  }
}

console.log("ShopApiClient class (src/game-client/api-client/shop.ts) created.");
