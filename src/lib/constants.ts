// src/lib/constants.ts

// Game specific constants
export const MAX_GHZ_INITIAL = 10; // GHZ level to trigger faction selection
export const MAX_PLAYERS_PER_ZONE = 100;
export const BASE_HP_POWER = 100;
export const BASE_HP_MEMORY = 100;

// Faction IDs (ensure these match faction.json or similar config)
export const FACTION_ID_AICORE = "AICore";
export const FACTION_ID_HACKER = "Hacker"; // Or "ShadowDecoders"

// API polling intervals or websocket settings
export const GAME_STATE_SYNC_INTERVAL = 5000; // ms

// UI related constants
export const DEFAULT_TOAST_DURATION = 3000; // ms

// Add more constants as your game develops
// e.g., item types, skill IDs, event types, etc.
