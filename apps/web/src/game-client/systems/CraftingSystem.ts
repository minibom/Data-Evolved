// src/game-client/systems/CraftingSystem.ts
import { BaseSystem } from './BaseSystem';
import type { GameClient } from '../index';
// Define Recipe, Item, CodeInjectionData types, ideally from @packages/common-types
type Recipe = any; // Placeholder
type Item = any; // Placeholder
type CodeInjectionData = any; // Placeholder

export class CraftingSystem extends BaseSystem {
  private availableRecipes: Recipe[] = [];

  constructor(game: GameClient) {
    super(game);
  }

  public init(): void {
    super.init();
    // Load available recipes for the player
    // this.fetchPlayerRecipes();
  }
  
  // private async fetchPlayerRecipes(): Promise<void> {
  //   const playerId = this.game.getCurrentPlayerId(); // Assuming GameClient has this
  //   if(playerId) {
  //      this.availableRecipes = await this.game.getApiClient().crafting.getAvailableRecipes(playerId);
  //   }
  // }

  public update(delta: number): void {
    // Handle crafting queue or timed crafting if applicable
  }

  public async craft(recipeId: string): Promise<Item | null> {
    console.log(`CraftingSystem: Attempting to craft recipe ${recipeId}.`);
    const recipe = this.availableRecipes.find(r => r.id === recipeId);
    if (!recipe) {
      console.warn(`Recipe ${recipeId} not found.`);
      return null;
    }
    // Check materials in player's inventory (via InventorySystem)
    // const inventorySystem = this.game.getSystem(InventorySystem);
    // const hasMaterials = recipe.materials.every(mat => inventorySystem.hasItem(this.game.getCurrentPlayerId(), mat.itemId, mat.quantity));
    // if (!hasMaterials) {
    //    console.warn("Insufficient materials for recipe.");
    //    return null;
    // }

    // try {
    //   const craftedItem = await this.game.getApiClient().crafting.craftItem(recipeId, recipe.materials);
    //   inventorySystem.consumeItems(this.game.getCurrentPlayerId(), recipe.materials);
    //   inventorySystem.addItem(this.game.getCurrentPlayerId(), craftedItem);
    //   console.log("Crafted item:", craftedItem);
    //   return craftedItem;
    // } catch (error) {
    //   console.error("Crafting failed on server:", error);
    //   return null;
    // }
    return { name: "Crafted Placeholder Item" } as Item; // Placeholder
  }

  public async upgrade(item: Item, materials: Item[]): Promise<Item | null> {
    console.log(`CraftingSystem: Attempting to upgrade item ${item.name}.`, materials);
    // Similar logic to craft, but for upgrading
    // const upgradedItem = await this.game.getApiClient().crafting.upgradeItem(item.id, materials);
    return { name: "Upgraded Placeholder Item" } as Item; // Placeholder
  }
  
  public async injectCode(itemId: string, code: CodeInjectionData): Promise<Item | null> {
    console.log(`CraftingSystem: Attempting to inject code into item ${itemId}.`, code);
    // return this.game.getApiClient().crafting.injectCode(itemId, code);
    return { name: "Code Injected Placeholder Item" } as Item; // Placeholder
  }
}

console.log("CraftingSystem class (src/game-client/systems/CraftingSystem.ts) updated.");
