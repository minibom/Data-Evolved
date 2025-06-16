// packages/common-types/guild.ts (or FactionHub)

export type GuildRank = "Leader" | "Officer" | "Veteran" | "Member" | "Initiate";

export interface GuildMember {
  playerId: string;
  playerName: string; // Denormalized for convenience
  rank: GuildRank;
  joinDate: string; // ISO date string
  // Potentially other member-specific info: contributions, last online
}

export interface GuildUpgrade {
  upgradeId: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  costPerLevel: Record<string, number>; // currencyType: amount
  effects: string[]; // Descriptions of buffs or features unlocked
}

export interface Guild {
  id: string; // Unique guild ID
  name: string;
  tag?: string; // Short tag, e.g., [CORE]
  description: string;
  leaderId: string; // PlayerID of the leader
  factionAffinity?: 'AICore' | 'Hacker' | string; // Optional strong alignment
  members: GuildMember[];
  maxMembers: number;
  level: number;
  xp: number;
  createdAt: string; // ISO date string
  motd?: string; // Message of the day
  bank?: Record<string, number>; // Guild bank: currencyType: amount
  upgrades?: GuildUpgrade[];
  // Logs of significant guild events (joins, leaves, upgrades)
  activityLog?: { timestamp: string; message: string }[];
}

console.log("Common Guild/FactionHub types (packages/common-types/guild.ts) loaded.");
