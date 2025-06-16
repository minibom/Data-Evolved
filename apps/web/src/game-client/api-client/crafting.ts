// src/game-client/api-client/crafting.ts
/**
 * CraftingApiClient provides methods for interacting with crafting and item upgrade APIs.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define Item, Recipe, CodeInjectionData types, ideally from @packages/common-types
// For now, using 'any' as placeholder.
type Item = any;
type Recipe = any;
type CodeInjectionData = any;

export class CraftingApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches available crafting recipes for a player.
   * This might be filtered by player skills or discovered recipes.
   * @param playerId Optional. The ID of the player, if recipes are player-specific.
   * @returns A promise that resolves with an array of available recipes.
   */
  public async getAvailableRecipes(playerId?: string): Promise<Recipe[]> {
    const endpoint = playerId ? `/crafting?playerId=${playerId}` : '/crafting';
    console.log(`CraftingApiClient: Fetching available recipes${playerId ? ` for player ${playerId}` : ''}.`);
    return this.apiClient.callApi<Recipe[]>(endpoint, undefined, 'GET');
  }

  /**
   * Attempts to craft an item using a specific recipe.
   * The server will validate materials and skill requirements.
   * @param playerId The ID of the player attempting to craft.
   * @param recipeId The ID of the recipe to use.
   * @param materials Optional. Client might send materials for validation, or server infers from recipeId.
   * @returns A promise that resolves with the crafted item if successful.
   */
  public async craftItem(playerId: string, recipeId: string, materials?: Item[]): Promise<Item> {
    console.log(`CraftingApiClient: Player ${playerId} crafting item with recipe ${recipeId}. Materials:`, materials);
    // If materials are not sent, server must look them up via recipeId and check player's inventory.
    return this.apiClient.callApi<Item>(`/crafting?playerId=${playerId}`, { recipeId, materials }, 'POST');
  }

  /**
   * Attempts to upgrade an existing item using specified materials or an upgrade path.
   * @param playerId The ID of the player attempting the upgrade.
   * @param upgradeItemId The instance ID of the item to be upgraded.
   * @param materialsUsed Optional. Materials used for the upgrade.
   * @returns A promise that resolves with the upgraded item if successful.
   */
  public async upgradeItem(playerId: string, upgradeItemId: string, materialsUsed?: any[]): Promise<Item> {
      console.log(`CraftingApiClient: Player ${playerId} upgrading item ${upgradeItemId}. Materials:`, materialsUsed);
      return this.apiClient.callApi<Item>(`/crafting/upgrade?playerId=${playerId}`, { upgradeItemId, materialsUsed }, 'POST');
  }


  /**
   * Injects a CodeFragment into a compatible item to modify its properties or grant abilities.
   * @param playerId The ID of the player performing the injection.
   * @param itemId The ID of the item to inject code into.
   * @param code The CodeInjectionData object containing the code fragment and target slot.
   * @returns A promise that resolves with the modified item if successful.
   */
  public async injectCode(playerId: string, itemId: string, code: CodeInjectionData): Promise<Item> {
    console.log(`CraftingApiClient: Player ${playerId} injecting code into item ${itemId}. Code:`, code);
    return this.apiClient.callApi<Item>(`/crafting/inject?playerId=${playerId}`, { itemId, code }, 'POST');
  }
}

console.log("CraftingApiClient class (src/game-client/api-client/crafting.ts) created and updated.");
