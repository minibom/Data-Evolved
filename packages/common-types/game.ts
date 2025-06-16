// packages/common-types/game.ts

export interface PlayerStats {
  power: number;    // Core HP
  memory: number;   // Mental HP
  firewall: number; // Defense
  ghz: number;      // Attack / Processing Speed
}

export interface PlayerAppearance {
  primaryColor: string;
  secondaryColor: string;
  // Potentially add fields for pattern, model, etc. later
}

export interface PlayerData { // Renamed from Player to PlayerData to represent the data structure
  id: string; // Corresponds to Firebase Auth UID
  name: string;
  level: number;
  xp: number;
  currentGHZ: number; // Separate from combat GHZ, tracks progress to faction choice
  stats: PlayerStats;
  factionId?: 'AICore' | 'Hacker' | string; // Faction ID, optional if player starts Neutral
  appearance: PlayerAppearance;
  inventory: ItemInstance[];
  activeQuests: string[]; // Quest IDs
  completedQuests: string[]; // Quest IDs
  skillTree?: any; // Define SkillTree structure later
  currency: {
    dataShards: number; // Main currency
    // other currencies
  };
  createdAt: string; // ISO Date string
  email?: string; // Optional, if synced from auth
  evolutionStage?: 'initial' | 'faction_chosen' | 'fully_developed';
  currentIconName?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'DataScrap' | 'Consumable' | 'Equipment' | 'QuestItem' | 'Material' | 'CodeFragment' | 'LoreFragment' | string;
  icon?: string;
  stackable: boolean;
  maxStack?: number;
  // Equipment specific
  slot?: 'weapon' | 'core_module' | 'defense_protocol' | 'utility_chip';
  statBonuses?: Partial<PlayerStats>;
  // Consumable specific
  effects?: any[]; // Define effect structure later
}

export interface ItemInstance extends Item {
  instanceId: string; // Unique ID for this specific item instance
  quantity: number;
}

export interface Quest {
  id:string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward;
  giverId?: string; // NPC or System
  requiredLevel?: number;
  isFactionQuest?: boolean;
  factionId?: string;
}

export interface QuestObjective {
  description: string;
  type: 'kill' | 'collect' | 'reach' | 'interact' | 'escort';
  targetId?: string; // e.g., enemy type ID, item ID, location ID
  targetCount?: number;
  currentCount: number;
  isCompleted: boolean;
}

export interface QuestReward {
  xp?: number;
  currency?: Partial<PlayerData['currency']>; // Updated to PlayerData
  items?: { itemId: string; quantity: number }[];
  factionStanding?: { factionId: string; amount: number };
}

export interface GameState {
  // This could represent the overall world state or a specific player's full game state for saving/loading
  worldTime: number; // In-game time
  activeGlobalEvents: string[]; // IDs of active world events
  // Potentially zone statuses, faction influences etc. for world state
  // For player game state, it would include Player object and other session specific data
  playerData?: PlayerData; // If this is a player-specific game state save
}


export interface Skill { id: string; name: string; description: string; cost: number; prereqs?: string[]; }
export interface SkillTree { unlockedSkills: string[]; availablePoints: number; }

export type FactionType = 'AICore' | 'Hacker' | 'Neutral' | string;

export interface Base { /* Define Base properties if needed */ }
export interface Reputation { /* Define Reputation properties if needed */ }
export interface CodeInjectionData { /* Define CodeInjectionData properties */ }


console.log("Common game types (packages/common-types/game.ts) loaded. PlayerData structure updated.");
