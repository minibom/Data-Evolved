// apps/web/src/game-client/events/ItemEvents.ts
/**
 * Defines game events related to items.
 * Published by InventorySystem, CraftingSystem, LootSystem, etc.
 * Subscribed to by UI systems, QuestSystem (for collection objectives), etc.
 */
import type { ClientGameEvent } from '@/lib/types/common-events';
// Assuming an Item type definition exists, e.g., from @packages/common-types/game
import type { Item } from '@packages/common-types/game';

// --- Item Added to Inventory Event (more detailed than ItemPickedUpClientEvent) ---
export const ITEM_ADDED_TO_INVENTORY_EVENT = "ITEM_ADDED_TO_INVENTORY";
export interface ItemAddedToInventoryEventData {
  item: Item; // Full item definition
  quantity: number;
  source?: 'pickup' | 'crafting' | 'quest_reward' | 'trade' | 'gm_command';
}
export interface ItemAddedToInventoryEvent extends ClientGameEvent {
  type: typeof ITEM_ADDED_TO_INVENTORY_EVENT;
  data: ItemAddedToInventoryEventData;
}

// --- Item Removed from Inventory Event ---
export const ITEM_REMOVED_FROM_INVENTORY_EVENT = "ITEM_REMOVED_FROM_INVENTORY";
export interface ItemRemovedFromInventoryEventData {
  itemId: string; // ID of the item definition
  quantity: number;
  reason?: 'used' | 'sold' | 'traded' | 'dropped' | 'crafting_material' | 'quest_turn_in';
}
export interface ItemRemovedFromInventoryEvent extends ClientGameEvent {
  type: typeof ITEM_REMOVED_FROM_INVENTORY_EVENT;
  data: ItemRemovedFromInventoryEventData;
}

// --- Item Used Event ---
export const ITEM_USED_EVENT = "ITEM_USED";
export interface ItemUsedEventData {
  itemId: string;
  usedByEntityId: string;
  targetEntityId?: string; // If used on another entity
  effectsApplied?: any[]; // Description of effects
}
export interface ItemUsedEvent extends ClientGameEvent {
  type: typeof ITEM_USED_EVENT;
  data: ItemUsedEventData;
}

// --- Item Crafted Event ---
export const ITEM_CRAFTED_EVENT = "ITEM_CRAFTED";
export interface ItemCraftedEventData {
  recipeId: string;
  craftedItem: Item; // The item that was successfully crafted
  quantityCrafted: number;
}
export interface ItemCraftedEvent extends ClientGameEvent {
  type: typeof ITEM_CRAFTED_EVENT;
  data: ItemCraftedEventData;
}

// --- Item Equipped/Unequipped Event ---
export const ITEM_EQUIPPED_EVENT = "ITEM_EQUIPPED";
export interface ItemEquippedEventData {
  entityId: string;
  item: Item;
  slot: string; // e.g., "weapon", "core_module"
}
export interface ItemEquippedEvent extends ClientGameEvent {
  type: typeof ITEM_EQUIPPED_EVENT;
  data: ItemEquippedEventData;
}

export const ITEM_UNEQUIPPED_EVENT = "ITEM_UNEQUIPPED";
export interface ItemUnequippedEventData {
  entityId: string;
  itemId: string; // ID of the item that was unequipped
  slot: string;
}
export interface ItemUnequippedEvent extends ClientGameEvent {
  type: typeof ITEM_UNEQUIPPED_EVENT;
  data: ItemUnequippedEventData;
}


console.log("Item-specific game events (apps/web/src/game-client/events/ItemEvents.ts) defined.");
