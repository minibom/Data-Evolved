// src/app/api/leaderboards/guild-rankings/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface GuildRankingEntry {
  rank: number;
  guildId: string;
  guildName: string;
  score: number; // e.g., total member GHZ, zones controlled, raid completions
  memberCount: number;
  factionId?: string; // Dominant faction if applicable
}

// Mock guild ranking data
const mockGuildRankings: GuildRankingEntry[] = [
  { rank: 1, guildId: "guild_alpha_core", guildName: "Alpha Core Protocol", score: 50000, memberCount: 25, factionId: "AICore" },
  { rank: 2, guildId: "guild_shadow_ops", guildName: "Shadow Operations", score: 48000, memberCount: 22, factionId: "Hacker" },
  { rank: 3, guildId: "guild_nexus_guardians", guildName: "Nexus Guardians", score: 45000, memberCount: 30 },
];

export async function GET(request: NextRequest) {
  // ... logic to fetch and sort guild ranking data ...
  return NextResponse.json(mockGuildRankings);
}
