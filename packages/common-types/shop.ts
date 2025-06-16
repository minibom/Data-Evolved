// packages/common-types/shop.ts

import type { Item } from './game'; // Assuming Item type is defined in game.ts

export interface ShopItem extends Omit<Item, 'instanceId' | 'quantity'> { // Shop lists item definitions, not instances
  price: number;
  currencyType?: string; // e.g., "dataShards", "glimmeringFragments" (defaults to main currency if not specified)
  stock?: number | 'infinite'; // Number available or infinite
  purchaseConditions?: { // Conditions to be able to purchase
    requiredLevel?: number;
    requiredFactionId?: string;
    requiredQuestCompleted?: string;
  };
  category?: string; // e.g., "Weapons", "Consumables", "Special"
  shopId?: string; // If multiple shops exist, which shop sells this
}

export interface Shop {
  id: string;
  name: string;
  description?: string;
  inventory: ShopItem[]; // List of items this shop sells
  // Potentially, shop-specific modifiers like discounts for faction members, etc.
  factionAffinity?: string; // Shop might be aligned with a faction
}


console.log("Common Shop types (packages/common-types/shop.ts) loaded.");
