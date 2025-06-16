// packages/common-types/boss.ts

import type { PlayerStats, Item } from './game'; // Assuming these types

export interface BossAbility {
  id: string;
  name: string;
  description: string;
  damage?: number; // Or more complex effect structure
  cooldown: number; // seconds
  castTime?: number; // seconds
  abilityType: 'single_target' | 'aoe' | 'buff' | 'debuff' | 'summon';
  // Additional parameters like range, area_of_effect_shape, etc.
}

export interface BossPhase {
  phaseNumber: number;
  name?: string; // e.g., "Enraged Phase"
  healthThreshold: number; // Percentage of boss HP to trigger this phase (e.g., 0.75 for 75%)
  newAbilities?: BossAbility[]; // Abilities gained in this phase
  modifiedAbilities?: Partial<BossAbility>[]; // Existing abilities that change
  // Other phase-specific mechanics
}

export interface BossLootTableEntry {
  itemId: string; // Reference to Item definition
  dropChance: number; // 0.0 to 1.0
  quantityMin: number;
  quantityMax: number;
  isUnique?: boolean; // e.g., only one drops per kill for the raid
}

export interface WorldBoss {
  id: string; // Unique ID for this boss type
  name: string;
  description: string;
  lore?: string;
  baseStats: PlayerStats; // Bosses can use a similar stat structure
  abilities: BossAbility[];
  phases?: BossPhase[];
  lootTable: BossLootTableEntry[];
  spawnConditions?: string; // e.g., "Appears during Data Storm event in Zone Gamma"
  respawnTimeMinutes?: number; // If it's a recurring boss
}

// For active boss encounters (might be in db.ts if stored in Firestore)
export interface ActiveBossEncounter {
  encounterId: string;
  bossId: string; // References WorldBoss.id
  currentHp: number;
  maxHp: number; // Usually from WorldBoss.baseStats.power * multiplier
  startTime: string; // ISO date string
  activePlayers: { playerId: string; damageDealt: number; joinedAt: string }[];
  currentPhase?: number;
  // status: 'active' | 'defeated' | 'despawned';
}

console.log("Common Boss types (packages/common-types/boss.ts) loaded.");
