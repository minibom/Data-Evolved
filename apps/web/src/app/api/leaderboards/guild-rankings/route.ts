// src/app/api/leaderboards/guild-rankings/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface GuildRankingEntry {
  rank: number;
  guildId: string;
  guildName: string;
  guildTag?: string;
  score: number; // e.g., total member GHZ, zones controlled, raid completions
  memberCount: number;
  factionAffinity?: 'AICore' | 'Hacker' | string; // Dominant faction if applicable
  level?: number;
}

// Mock guild ranking data
const mockGuildRankings: GuildRankingEntry[] = [
  { rank: 1, guildId: "guild_alpha_core", guildName: "Alpha Core Protocol", guildTag: "ACP", score: 50000, memberCount: 25, factionAffinity: "AICore", level: 5 },
  { rank: 2, guildId: "guild_shadow_ops", guildName: "Shadow Operations", guildTag: "SOPS", score: 48000, memberCount: 22, factionAffinity: "Hacker", level: 4 },
  { rank: 3, guildId: "guild_nexus_guardians", guildName: "Nexus Guardians", guildTag: "NG", score: 45000, memberCount: 30, level: 4 },
  { rank: 4, guildId: "guild_data_miners_inc", guildName: "Data Miners Inc.", guildTag: "DMI", score: 30000, memberCount: 15, level: 3 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  // const sortBy = searchParams.get('sortBy') || 'score'; // Future: allow sorting by members, level, etc.

  // ... logic to fetch and sort guild ranking data from DB ...
  // For now, use mock data
  const sortedRankings = mockGuildRankings.sort((a,b) => b.score - a.score).slice(0, limit);
  
  // Re-assign ranks after sorting and slicing
  sortedRankings.forEach((entry, index) => entry.rank = index + 1);
  
  return NextResponse.json(sortedRankings);
}
