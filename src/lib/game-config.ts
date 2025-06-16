// src/lib/game-config.ts

// This file can hold static game configurations that might be too complex for simple JSON
// or require some initial processing. For purely static data, prefer JSON files in /data.

interface ItemConfig {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'consumable' | 'material';
  basePrice?: number;
  // other item properties
}

interface ShopItemConfig extends ItemConfig {
  shopStock?: number; // How many are available in the shop initially
}

interface GuildLevelConfig {
  level: number;
  xpRequired: number;
  memberCapacity: number;
  buffs: string[]; // Descriptions of buffs
}

export const STATIC_SHOP_ITEMS: ShopItemConfig[] = [
  { id: "basic_data_shard", name: "Basic Data Shard", description: "A small fragment of raw data.", type: "material", basePrice: 10, shopStock: 100 },
  { id: "health_stim_pack", name: "Health Stim Pack", description: "Restores a small amount of Power.", type: "consumable", basePrice: 50, shopStock: 20 },
  // Add more static shop items if needed, though dynamic items might come from a DB or ai_base_directives.json for AI generated ones.
];

export const GUILD_LEVEL_CONFIG: GuildLevelConfig[] = [
  { level: 1, xpRequired: 0, memberCapacity: 10, buffs: ["+1% GHZ for all members"] },
  { level: 2, xpRequired: 1000, memberCapacity: 15, buffs: ["+2% GHZ for all members", "+1% Firewall"] },
  // ... more levels
];

// Potentially, default settings for AI behaviors if not managed by ai_faction_goals.json
export const DEFAULT_AI_CORE_BEHAVIOR = {
  priority: "stability",
  preferredActionTypes: ["reinforce_zone", "guide_players"],
};

export const DEFAULT_ANONYMOUS_BEHAVIOR = {
  priority: "disruption",
  preferredActionTypes: ["inject_anomaly", "scramble_comms"],
};

// console.log("Game config loaded.");
