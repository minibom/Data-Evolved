// @/app/api/game/character/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { requireAuth } from '@/lib/auth/server-auth'; // For server-side token verification
import { setDocument } from '@/lib/db/firestore'; // Firestore helper (currently placeholder)
import type { PlayerData, PlayerStats } from '@packages/common-types/game'; 
import { FACTION_ID_NEUTRAL, DEFAULT_PLAYER_POWER, DEFAULT_PLAYER_MEMORY, DEFAULT_PLAYER_FIREWALL, DEFAULT_PLAYER_GHZ } from '@/lib/constants/game-constants';

export async function POST(request: NextRequest) {
  let userId: string;
  let userEmail: string | undefined;

  // In a production app, you'd verify the token and get UID server-side:
  // try {
  //   const authenticatedUser = await requireAuth(request); // Verifies Firebase ID token from Authorization header
  //   userId = authenticatedUser.uid;
  //   userEmail = authenticatedUser.email;
  // } catch (authError: any) {
  //   console.error("API Character Creation Auth Error:", authError);
  //   return NextResponse.json({ error: 'Unauthorized: ' + authError.message }, { status: 401 });
  // }

  try {
    const body = await request.json();
    // For now, we trust the UID from the client. THIS IS NOT SECURE FOR PRODUCTION.
    const { uid, name, factionId, appearance } = body; 

    if (!uid) {
      return NextResponse.json({ error: 'User ID (uid) is missing from request. User must be authenticated.' }, { status: 400 });
    }
    userId = uid; // Assign uid from body

    if (!name || typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 20) {
      return NextResponse.json({ error: 'Character name is required and must be between 3 and 20 characters.' }, { status: 400 });
    }
    // Basic Faction ID validation (allow Neutral)
    if (!factionId || typeof factionId !== 'string' || !['AICore', 'Hacker', FACTION_ID_NEUTRAL].includes(factionId)) {
      return NextResponse.json({ error: 'Valid Faction ID (AICore, Hacker, or Neutral) is required.' }, { status: 400 });
    }
    if (!appearance || typeof appearance.primaryColor !== 'string' || typeof appearance.secondaryColor !== 'string') {
        return NextResponse.json({ error: 'Appearance data (primaryColor, secondaryColor) is required.' }, { status: 400 });
    }


    // TODO: Check if character already exists for this user ID (e.g., in Firestore)
    // const existingCharacter = await getDocument('players', userId);
    // if (existingCharacter) {
    //   return NextResponse.json({ error: 'Character already exists for this user.' }, { status: 409 });
    // }

    const initialStats: PlayerStats = {
        power: DEFAULT_PLAYER_POWER,
        memory: DEFAULT_PLAYER_MEMORY,
        firewall: DEFAULT_PLAYER_FIREWALL,
        ghz: DEFAULT_PLAYER_GHZ, // This is combat GHZ, not progression GHZ
    };

    const newCharacterData: PlayerData = {
      id: userId, // Using user ID as player ID
      name: name.trim(),
      level: 1,
      xp: 0,
      currentGHZ: 0, // Initial progression GHZ, different from combat stat GHZ
      stats: initialStats,
      factionId: factionId === FACTION_ID_NEUTRAL ? undefined : factionId, // Store undefined if Neutral
      appearance: {
        primaryColor: appearance.primaryColor,
        secondaryColor: appearance.secondaryColor,
      },
      inventory: [], // Start with empty inventory
      activeQuests: [],
      completedQuests: [],
      currency: { dataShards: 0 }, // Start with 0 currency
      createdAt: new Date().toISOString(),
      // email: userEmail, // If fetched from verified token
    };

    // "Save" to Firestore (currently a placeholder)
    // This would be where you interact with the actual Firebase Admin SDK if configured.
    await setDocument('players', userId, newCharacterData); 
    console.log(`API: Character data for user ${userId} prepared for Firestore (simulated save):`, newCharacterData);

    return NextResponse.json({ message: 'Character created successfully!', character: newCharacterData }, { status: 201 });

  } catch (error: any) {
    console.error("API Character Creation Error:", error);
    return NextResponse.json({ error: 'Failed to create character.', details: error.message || String(error) }, { status: 500 });
  }
}
