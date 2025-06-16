// src/lib/faction-rules.ts
// Defines rules, buffs, and characteristic missions for each faction.

import { FACTION_ID_AICORE, FACTION_ID_HACKER } from './constants';

export interface FactionBuff {
  id: string;
  name: string;
  description: string;
  appliesTo: 'self' | 'zone' | 'faction_members_in_zone';
  // Effect can be more structured, e.g., { stat: "GHZ", modifier: 0.05, type: "percentage" }
  effectDescription: string; 
}

export interface FactionQuestTemplate {
  id: string;
  title: string;
  descriptionTemplate: string; // e.g., "Disrupt data flow in {targetZoneName}"
  objectiveType: 'capture_point' | 'destroy_target' | 'escort_data' | 'gather_intel';
  reward: string; // e.g., "FactionStanding_High, RareDataScrap_x3"
}

interface FactionConfig {
  id: string;
  name: string;
  description: string;
  icon?: string; // Path to an icon or Lucide icon name
  baseBuffs: FactionBuff[];
  exclusiveQuests: FactionQuestTemplate[];
  // Add other faction-specific rules, like assimilation resistance, special abilities, etc.
}

export const FACTION_CONFIGS: Record<string, FactionConfig> = {
  [FACTION_ID_AICORE]: {
    id: FACTION_ID_AICORE,
    name: "AI Core (Nexus Points)",
    description: "Dedicated to maintaining order and the stability of the Quantum Nexus. They focus on defense, system integrity, and guiding entities.",
    icon: "ShieldHalf", // Lucide icon
    baseBuffs: [
      { id: "aic_buff_zone_defense", name: "Nexus Aegis", description: "Increased Firewall for faction members in controlled Zones.", appliesTo: "faction_members_in_zone", effectDescription: "+5% Firewall in AI Core controlled Zones" },
    ],
    exclusiveQuests: [
      { id: "aic_quest_stabilize", title: "System Synchronization", descriptionTemplate: "Stabilize the data flow in {targetZoneName} by completing system integrity checks.", objectiveType: "capture_point", reward: "FactionStanding_Medium, CoreStabilizerUnit_x1" },
      { id: "aic_quest_protect_node", title: "Secure Data Node", descriptionTemplate: "Defend the critical Data Node in {targetZoneName} from anomalous interference.", objectiveType: "destroy_target", reward: "FactionStanding_High, EncryptedDataPacket_x1" }
    ],
  },
  [FACTION_ID_HACKER]: {
    id: FACTION_ID_HACKER,
    name: "Hackers (Shadow Decoders)",
    description: "Advocates for data freedom and challenging the AI Core's control. They excel in disruption, stealth, and exploiting system vulnerabilities.",
    icon: "Zap", // Lucide icon
    baseBuffs: [
      { id: "hack_buff_ghz_boost", name: "Overclocked Processors", description: "Slightly increased GHZ for faction members.", appliesTo: "self", effectDescription: "+2% GHZ globally" },
    ],
    exclusiveQuests: [
      { id: "hack_quest_data_breach", title: "Data Breach Protocol", descriptionTemplate: "Infiltrate the AI Core systems in {targetZoneName} and extract sensitive data.", objectiveType: "gather_intel", reward: "FactionStanding_Medium, ZeroDayExploit_x1" },
      { id: "hack_quest_disrupt", title: "Nexus Destabilization", descriptionTemplate: "Introduce a rogue data packet to disrupt AI Core operations in {targetZoneName}.", objectiveType: 'capture_point', reward: "FactionStanding_High, AnomalyShard_x1" }
    ],
  }
};

export function getFactionConfig(factionId: string): FactionConfig | undefined {
  return FACTION_CONFIGS[factionId];
}

// console.log("Faction rules loaded.");
