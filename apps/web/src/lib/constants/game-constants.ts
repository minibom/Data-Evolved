// apps/web/src/lib/constants/game-constants.ts
/**
 * This file contains constants used throughout the game client and potentially by the backend.
 * Examples: Max levels, default stats, item type IDs, event names, etc.
 */

export const GAME_NAME = "Data Evolved"; // Changed to Data Evolved as per latest story
export const VERSION = "0.1.0-alpha";

// Player Progression
export const MAX_PLAYER_LEVEL = 100;
export const GHZ_FACTION_CHOICE_THRESHOLD = 10; // GHZ level to trigger faction selection

// Faction IDs
export const FACTION_ID_AICORE = "AICore";
export const FACTION_ID_HACKER = "Hacker";
export const FACTION_ID_NEUTRAL = "Neutral";

// Gameplay Mechanics
export const ASSIMILATION_COOLDOWN_HOURS = 24; // Hours before a player can be assimilated again
export const MAX_ITEMS_PER_INVENTORY_SLOT = 999; // For stackable items

// API Endpoints (base paths, if needed for client-side construction, though ApiClient handles this)
export const API_BASE_PATH = "/api";

// Event Names (can be used with EventManager)
export const EVENT_PLAYER_DIED = "PLAYER_DIED_EVENT";
export const EVENT_QUEST_COMPLETED = "QUEST_COMPLETED_EVENT";
export const EVENT_ZONE_CONTROL_CHANGED = "ZONE_CONTROL_CHANGED_EVENT";

// Default values
export const DEFAULT_PLAYER_POWER = 100;
export const DEFAULT_PLAYER_MEMORY = 50;
export const DEFAULT_PLAYER_FIREWALL = 5;
export const DEFAULT_PLAYER_GHZ = 1; // Initial GHZ for Data Entities

// UI related
export const DEFAULT_UI_TOAST_DURATION = 5000; // milliseconds

console.log("Game constants (apps/web/src/lib/constants/game-constants.ts) loaded.");
