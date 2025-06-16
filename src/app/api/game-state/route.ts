// src/app/api/game-state/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Placeholder for game state type (will be imported from @packages/common-types)
interface GameState {
  playerId: string;
  currentGHZ: number;
  factionId?: string;
  // Add other game state fields like Power, Memory, Firewall, inventory, quests, etc.
  stats: { power: number; memory: number; firewall: number; ghz: number };
  lastSaved: string;
}

// Mock database for game state
const mockGameStates: Record<string, GameState> = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId');

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
  }

  const gameState = mockGameStates[playerId];
  if (!gameState) {
    return NextResponse.json({ error: 'Game state not found for player' }, { status: 404 });
  }

  return NextResponse.json(gameState);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, ...dataToSave } = body;

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required to save game state' }, { status: 400 });
    }

    const newGameState: GameState = {
      playerId,
      currentGHZ: dataToSave.currentGHZ || 0,
      factionId: dataToSave.factionId,
      stats: dataToSave.stats || { power: 10, memory: 10, firewall: 5, ghz: 1 },
      lastSaved: new Date().toISOString(),
      ...dataToSave, // Allow other fields to be passed
    };

    mockGameStates[playerId] = newGameState;
    console.log(`Game state saved for player ${playerId}:`, newGameState);
    return NextResponse.json({ message: 'Game state saved successfully', gameState: newGameState }, { status: 200 });

  } catch (error) {
    console.error('Error saving game state:', error);
    return NextResponse.json({ error: 'Failed to save game state' }, { status: 500 });
  }
}
