// src/app/api/quest/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Quest, PlayerQuestDoc } from '@packages/common-types/game'; // Assuming types are in common package

// Mock database for player quests
const mockPlayerQuests: Record<string, PlayerQuestDoc[]> = {
  "player123": [
    { questId: "tutorial_collect_scraps", status: "active", progress: { 0: 5 }, startedAt: new Date().toISOString() },
    { questId: "faction_intro_aicore", status: "completed", progress: {0:1, 1:1}, startedAt: new Date().toISOString(), completedAt: new Date().toISOString() },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); // In real app, get from session

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
  }

  const quests = mockPlayerQuests[playerId] || [];
  return NextResponse.json(quests);
}

export async function POST(request: NextRequest) {
  // For accepting a new quest or updating progress
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); // In real app, get from session

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
  }

  try {
    const { questId, action, progressUpdate } = await request.json(); // action: 'accept', 'progress', 'complete'
    
    if (!questId || !action) {
      return NextResponse.json({ error: 'Quest ID and action are required' }, { status: 400 });
    }

    if (!mockPlayerQuests[playerId]) {
      mockPlayerQuests[playerId] = [];
    }

    // ... logic to handle accepting, updating, or completing quests ...
    // Example: updating progress
    // const questIndex = mockPlayerQuests[playerId].findIndex(q => q.questId === questId);
    // if (questIndex > -1 && action === 'progress' && progressUpdate) {
    //   mockPlayerQuests[playerId][questIndex].progress = { ...mockPlayerQuests[playerId][questIndex].progress, ...progressUpdate };
    // }
    console.log(`Quest action for ${playerId}: quest ${questId}, action ${action}`);

    return NextResponse.json({ message: 'Quest status updated successfully', quests: mockPlayerQuests[playerId] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quest status' }, { status: 500 });
  }
}
