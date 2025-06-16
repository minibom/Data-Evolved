// apps/web/src/app/api/anomaly-dungeon/route.ts
/**
 * API Route for Anomaly Dungeons (Quantum Realms).
 * Handles entering dungeons (which involves AI generation), updating progress, and reporting outcomes.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateQuantumRealm, type QuantumRealmInput, type QuantumRealmOutput } from '@game-ai-flows/quantumRealmGenerator';
// import { verifyUser } from '@/lib/auth/server-auth';
// import { saveDungeonSessionToDB, getDungeonSessionFromDB, updateDungeonProgressInDB, logDungeonOutcomeInDB } from '@/lib/db/firestore'; // Example DB functions

interface DungeonSession {
  sessionId: string;
  playerId: string;
  dungeonDetails: QuantumRealmOutput; // The AI-generated realm details
  startTime: string; // ISO Date string
  progress?: Record<string, any>; // Player's progress within this specific session (e.g., rooms_cleared, objectives_met)
  isActive: boolean;
  lastAccessed: string; // ISO Date string
}

// Mock active dungeon sessions (in-memory for simplicity, use DB in production)
const activeSessions: Record<string, DungeonSession> = {};

export async function POST(request: NextRequest) {
  // const user = await verifyUser(request);
  // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // const playerId = user.uid;
  const playerId = "mock_player_" + Math.floor(Math.random() * 1000); // Placeholder

  const body = await request.json();
  const { 
    action,                 // 'enter', 'update_progress', 'report_outcome'
    dungeonId,              // Existing session ID for update/report
    realmInputParams,       // QuantumRealmInput for 'enter' action
    progressData,           // For 'update_progress'
    outcomeType,            // 'completed', 'failed', 'abandoned' for 'report_outcome'
    outcomeDetails          // Additional details for 'report_outcome'
  } = body;

  if (action === 'enter') {
    if (!realmInputParams) {
      return NextResponse.json({ error: 'Realm input parameters (realmInputParams) are required to generate and enter an anomaly dungeon.' }, { status: 400 });
    }

    try {
      const realmInput: QuantumRealmInput = realmInputParams; // TODO: Validate with Zod schema if possible server-side
      const generatedDungeon: QuantumRealmOutput = await generateQuantumRealm(realmInput);
      
      const newSessionId = `ad_sess_${generatedDungeon.realmId}_${Date.now()}`;
      const newSession: DungeonSession = {
        sessionId: newSessionId,
        playerId,
        dungeonDetails: generatedDungeon,
        startTime: new Date().toISOString(),
        isActive: true,
        lastAccessed: new Date().toISOString(),
      };
      activeSessions[newSessionId] = newSession; // Store mock session
      // await saveDungeonSessionToDB(newSession);
      
      console.log(`AnomalyDungeon API: Player ${playerId} entered new dungeon '${generatedDungeon.name}' (Session: ${newSessionId})`);
      return NextResponse.json(newSession, { status: 201 });

    } catch (error: any) {
      console.error('AnomalyDungeon API: Error generating or entering anomaly dungeon:', error);
      return NextResponse.json({ error: 'Failed to generate or enter anomaly dungeon', details: error.message || String(error) }, { status: 500 });
    }
  } else if (action === 'update_progress' && dungeonId && progressData) {
    const session = activeSessions[dungeonId];
    if (!session || !session.isActive || session.playerId !== playerId) {
      return NextResponse.json({ error: 'Active dungeon session not found for this player or invalid session ID.' }, { status: 404 });
    }
    session.progress = { ...(session.progress || {}), ...progressData };
    session.lastAccessed = new Date().toISOString();
    // await updateDungeonProgressInDB(dungeonId, session.progress);
    console.log(`AnomalyDungeon API: Player ${playerId} updated progress for session ${dungeonId}.`);
    return NextResponse.json({ message: "Progress updated successfully.", session });

  } else if (action === 'report_outcome' && dungeonId && outcomeType) {
     const session = activeSessions[dungeonId];
    if (!session || session.playerId !== playerId) { // Ensure player owns the session they're reporting for
      return NextResponse.json({ error: 'Dungeon session not found for this player.' }, { status: 404 });
    }
    session.isActive = false; // Mark as no longer active
    session.lastAccessed = new Date().toISOString();
    // TODO: Log outcome, grant rewards based on outcomeType and outcomeDetails, update player stats/achievements
    // await logDungeonOutcomeInDB(dungeonId, playerId, outcomeType, outcomeDetails);
    // delete activeSessions[dungeonId]; // Clean up mock session, or mark as inactive in DB
    
    const rewards = outcomeType === 'completed' ? { xp: 500, rare_data_fragments: 3 } : { xp: 50 }; // Mock rewards
    console.log(`AnomalyDungeon API: Player ${playerId} reported outcome '${outcomeType}' for session ${dungeonId}. Details:`, outcomeDetails);
    return NextResponse.json({ message: `Dungeon outcome '${outcomeType}' reported.`, rewards });
  }

  return NextResponse.json({ error: 'Invalid action or missing parameters for anomaly dungeon.' }, { status: 400 });
}

// GET might be used to fetch details of an *active* dungeon session if IDs are persistent
// or to list available pre-generated (but not yet entered) anomaly instances.
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    // const user = await verifyUser(request);
    // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // const playerId = user.uid;

    if (!sessionId) {
        // Could list player's active sessions or available public anomalies if desired
        return NextResponse.json({ error: "Session ID is required to fetch specific dungeon details." }, { status: 400 });
    }
    
    const session = activeSessions[sessionId];
    // In a real app, fetch from DB: const session = await getDungeonSessionFromDB(sessionId);

    if (session /* && session.playerId === playerId */ && session.isActive) { // Ensure player owns session
        session.lastAccessed = new Date().toISOString();
        return NextResponse.json(session);
    }
    return NextResponse.json({ error: "Active dungeon session not found or not accessible by this player." }, { status: 404 });
}
