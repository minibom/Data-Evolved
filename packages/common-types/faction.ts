// packages/common-types/faction.ts
// Defines the static properties of factions, like their base buffs, exclusive quests, etc.
// This is different from aiFaction.ts which is about the AI entities' dynamic state.

// This can reference types from game.ts if needed for quest rewards etc.
// import type { QuestReward, Item } from './game';

export interface FactionBuff {
  id: string;
  name: string;
  description: string;
  // How the buff is applied (e.g., passive, zone-specific, temporary)
  applicationType: 'passive_global' | 'zone_control_bonus' | 'active_ability';
  effect: string; // Text description of the effect, or a structured effect object
  // Example structured effect:
  // effectDetails?: { stat: keyof PlayerStats, modifier: number, type: 'percentage' | 'flat' };
}

export interface FactionExclusiveQuest {
  questIdTemplate: string; // e.g., "aicore_stabilize_zone_{zoneName}"
  titleTemplate: string;
  descriptionTemplate: string;
  // objectiveType, rewardStructure can be defined here or reference a generic QuestTemplate
}

export interface FactionRank {
  rankLevel: number;
  name: string;
  xpToNextRank: number;
  perks: string[]; // Descriptions of perks unlocked at this rank
}

export interface FactionData {
  id: 'AICore' | 'Hacker' | string; // Use specific IDs from constants.ts
  name: string;
  longName?: string; // e.g., "AI Core (Nexus Points)"
  description: string;
  lore: string;
  icon?: string; // Lucide icon name or asset path
  playerAlignment: 'Lawful' | 'Chaotic' | 'Neutral' | string; // Broader alignment
  startingSkills: string[]; // IDs of skills players get upon joining

  baseBuffs?: FactionBuff[];
  exclusiveQuests?: FactionExclusiveQuest[];
  ranks?: FactionRank[]; // Progression within the faction

  // Special abilities or mechanics unique to the faction
  uniqueMechanics?: {
    name: string;
    description: string;
  }[];
}

console.log("Common Faction Data types (packages/common-types/faction.ts) loaded.");
