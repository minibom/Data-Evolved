// src/app/api/leaderboards/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string; // Denormalized for convenience
  score: number; // Could be GHZ, XP, PvP wins, etc.
  factionId?: string;
}

// Mock leaderboard data
const mockGlobalLeaderboard: LeaderboardEntry[] = [
  { rank: 1, playerId: "player_max_ghz", playerName: "MaximusByte", score: 1500, factionId: "AICore" },
  { rank: 2, playerId: "player_chaos_agent", playerName: "GlitchMaster", score: 1450, factionId: "Hacker" },
  { rank: 3, playerId: "player_steady_grind", playerName: "DataWeaver", score: 1200 },
];

export async function GET(request: NextRequest) {
  // const { searchParams } = new URL(request.url);
  // const leaderboardType = searchParams.get('type') || 'global_xp'; // e.g., global_xp, pvp_wins, zone_captures
  // const limit = parseInt(searchParams.get('limit') || '100');

  // ... logic to fetch and sort appropriate leaderboard data ...
  // For now, just return mock global data
  return NextResponse.json(mockGlobalLeaderboard);
}
