// @/app/api/game/character/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/server-auth'; // For server-side token verification
import { setDocument } from '@/lib/db/firestore'; 
import type { PlayerData, PlayerStats } from '@packages/common-types/game'; 
import { FACTION_ID_NEUTRAL, DEFAULT_PLAYER_POWER, DEFAULT_PLAYER_MEMORY, DEFAULT_PLAYER_FIREWALL, DEFAULT_PLAYER_GHZ, DEFAULT_STARTING_PROGRESSION_GHZ } from '@/lib/constants/game-constants';

export async function POST(request: NextRequest) {
  let authenticatedUser;
  try {
    authenticatedUser = await requireAuth(request); // Verifies Firebase ID token from Authorization header
  } catch (authError: any) {
    console.error("API Character Creation Auth Error:", authError.message);
    return NextResponse.json({ error: 'Unauthorized: ' + authError.message }, { status: 401 });
  }

  const userId = authenticatedUser.uid; // UID from verified token
  const userEmail = authenticatedUser.email; // Email from verified token

  try {
    const body = await request.json();
    const { name, factionId, appearance } = body; 

    if (!name || typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 20) {
      return NextResponse.json({ error: 'Character name is required and must be between 3 and 20 characters.' }, { status: 400 });
    }
    
    if (!factionId || typeof factionId !== 'string' || ![FACTION_ID_AICORE, FACTION_ID_HACKER, FACTION_ID_NEUTRAL].includes(factionId)) {
      return NextResponse.json({ error: 'Valid Faction ID (AICore, Hacker, or Neutral) is required.' }, { status: 400 });
    }
    if (!appearance || typeof appearance.primaryColor !== 'string' || typeof appearance.secondaryColor !== 'string') {
        return NextResponse.json({ error: 'Appearance data (primaryColor, secondaryColor) is required.' }, { status: 400 });
    }

    // Check if character already exists for this user ID in Firestore
    // const existingCharacter = await getDocument('players', userId); // Assuming getDocument is implemented
    // if (existingCharacter) {
    //   return NextResponse.json({ error: 'Character already exists for this user.' }, { status: 409 });
    // }

    const initialStats: PlayerStats = {
        power: DEFAULT_PLAYER_POWER,
        memory: DEFAULT_PLAYER_MEMORY,
        firewall: DEFAULT_PLAYER_FIREWALL,
        ghz: DEFAULT_PLAYER_GHZ, 
    };

    const newCharacterData: PlayerData = {
      id: userId, 
      name: name.trim(),
      level: 1,
      xp: 0,
      currentGHZ: DEFAULT_STARTING_PROGRESSION_GHZ,
      stats: initialStats,
      factionId: factionId === FACTION_ID_NEUTRAL ? undefined : factionId, 
      appearance: {
        primaryColor: appearance.primaryColor,
        secondaryColor: appearance.secondaryColor,
      },
      inventory: [], 
      activeQuests: [],
      completedQuests: [],
      currency: { dataShards: 0 }, 
      createdAt: new Date().toISOString(),
      email: userEmail, // Store email from verified token
      evolutionStage: 'initial',
    };

    await setDocument('players', userId, newCharacterData); 
    console.log(`API: Character data for user ${userId} saved to Firestore:`, newCharacterData);

    return NextResponse.json({ message: 'Character created successfully!', character: newCharacterData }, { status: 201 });

  } catch (error: any) {
    console.error("API Character Creation Error:", error);
    return NextResponse.json({ error: 'Failed to create character.', details: error.message || String(error) }, { status: 500 });
  }
}
