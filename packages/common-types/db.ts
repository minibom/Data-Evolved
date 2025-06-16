// packages/common-types/db.ts
// Defines structures for Firestore (or other DB) collections/documents.
// These often align with or extend types from game.ts and aiFaction.ts.

import type { Player, Item, Quest } from './game';
import type { AIFactionState, AIDirective } from './aiFaction';

// Example Firestore document structures (you'll refine these)

export interface UserDoc extends Omit<Player, 'id' | 'inventory' | 'activeQuests' | 'completedQuests'> {
  // id is the document ID in Firestore
  email: string;
  createdAt: string; // ISO Date string
  // other auth related fields if not using Firebase Auth directly for all user data
}

// Subcollection for player inventory
export interface PlayerInventoryDoc { // path: /users/{userId}/inventory/{itemInstanceId}
  itemId: string; // reference to items.json or items collection
  quantity: number;
  // any instance-specific data (e.g., durability for equipment)
}

// Subcollection for player quests
export interface PlayerQuestDoc { // path: /users/{userId}/quests/{questId}
  questId: string; // reference to quest_templates.json or quests collection
  status: 'active' | 'completed' | 'failed';
  progress: Record<number, number>; // objective_index: current_count
  startedAt: string;
  completedAt?: string;
}

// World State Documents
export interface ZoneStateDoc { // path: /zones/{zoneId}
  zoneId: string;
  controllingFactionId?: string;
  factionInfluence: Record<string, number>; // factionId: influencePoints
  synchronizationPoints: Record<string, number>; // factionId: points
  status: 'stable' | 'contested' | 'under_attack' | 'lockdown';
  activeEvents: string[]; // IDs of events specific to this zone
  upgrades: Record<string, number>; // upgradeId: level
  lastUpdated: string;
}

export interface WorldEventDoc { // path: /worldEvents/{eventId}
  eventId: string;
  name: string;
  description: string;
  type: 'global_buff' | 'zone_anomaly' | 'boss_spawn' | 'narrative_event';
  startTime: string;
  durationMinutes?: number; // For timed events
  isActive: boolean;
  affectedZones?: string[];
  // event-specific parameters
}

// AI Faction States and Directives Log
export interface AIFactionStateDoc extends AIFactionState { // path: /aiFactionStates/{factionName}
  // factionName is the document ID (e.g., "AICore", "Anonymous")
  historyLog?: string[]; // Log of recent significant actions or decisions
}

export interface AIDirectiveLogDoc extends AIDirective { // path: /aiDirectivesLog/{directiveId}
  // directiveId is the document ID
  parsedActions?: any[]; // Store result from ai-directive-parser.ts
  executionStatus?: 'pending' | 'executed' | 'failed' | 'skipped';
  executedAt?: string;
}

// Other collections based on your diagram:
// shops, guilds, worldBosses, bossEncounters, auctionListings, transactionHistory,
// friends, chatMessages, recipes, achievements, worldHistoryLog, playerAIVotes,
// factionBattles, dataAnomalies.

// Example for a simple `shops` document
export interface ShopDoc { // path: /shops/{shopId}
  shopId: string;
  name: string;
  inventory: Array<{ itemId: string; price: number; stock?: number }>; // stock can be dynamic
}

// Example for `factionBattles`
export interface FactionBattleDoc { // path: /factionBattles/{battleId}
  battleId: string;
  zoneId: string;
  involvedFactions: string[];
  startTime: string;
  endTime?: string;
  outcome?: string; // e.g., "AICoreVictory", "Stalemate"
  log: string[]; // Battle events
}


console.log("Common DB types (packages/common-types/db.ts) loaded.");
