// src/app/api/leaderboards/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string; // Denormalized for convenience
  score: number; // Could be GHZ, XP, PvP wins, etc.
  factionId?: 'AICore' | 'Hacker' | string;
  level?: number;
}

// Mock leaderboard data
const mockGlobalLeaderboard_GHZ: LeaderboardEntry[] = [
  { rank: 1, playerId: "player_max_ghz", playerName: "MaximusByte", score: 1500, factionId: "AICore", level: 50 },
  { rank: 2, playerId: "player_chaos_agent", playerName: "GlitchMaster", score: 1450, factionId: "Hacker", level: 48 },
  { rank: 3, playerId: "player_steady_grind", playerName: "DataWeaver", score: 1200, level: 45 },
  { rank: 4, playerId: "player_newbie", playerName: "BitStream", score: 150, factionId: "Neutral", level: 12 },
];
const mockGlobalLeaderboard_PvPWins: LeaderboardEntry[] = [
  { rank: 1, playerId: "player_pvp_king", playerName: "NexusDominator", score: 120, factionId: "AICore", level: 55 },
  { rank: 2, playerId: "player_chaos_agent", playerName: "GlitchMaster", score: 110, factionId: "Hacker", level: 48 },
];


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leaderboardType = searchParams.get('type') || 'ghz_ranking'; // e.g., ghz_ranking, pvp_wins, zone_captures
  const limit = parseInt(searchParams.get('limit') || '10'); // Default to top 10

  let dataToReturn: LeaderboardEntry[] = [];

  // ... logic to fetch and sort appropriate leaderboard data from DB ...
  if (leaderboardType === 'ghz_ranking') {
    dataToReturn = mockGlobalLeaderboard_GHZ.sort((a, b) => b.score - a.score).slice(0, limit);
  } else if (leaderboardType === 'pvp_wins') {
    dataToReturn = mockGlobalLeaderboard_PvPWins.sort((a, b) => b.score - a.score).slice(0, limit);
  } else {
    return NextResponse.json({ error: "Invalid leaderboard type requested." }, { status: 400 });
  }
  
  // Re-assign ranks after sorting and slicing
  dataToReturn.forEach((entry, index) => entry.rank = index + 1);

  return NextResponse.json(dataToReturn);
}
