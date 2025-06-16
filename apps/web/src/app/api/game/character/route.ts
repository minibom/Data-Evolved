// @/app/api/game/character/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { verifyUser } from '@/lib/auth/server-auth'; // For authenticating the user
// import { setDoc, getDoc } from '@/lib/db/firestore'; // Firestore helpers
// import type { PlayerData } from '@packages/common-types/game'; // Assuming PlayerData type

export async function POST(request: NextRequest) {
  // const authenticatedUser = await verifyUser(request); // Verify Firebase ID token
  // if (!authenticatedUser) {
  //   return NextResponse.json({ error: 'Unauthorized. User must be logged in to create a character.' }, { status: 401 });
  // }
  // const userId = authenticatedUser.uid;
  const userId = `mock_user_${Date.now()}`; // Placeholder if auth is not yet fully set up

  try {
    const body = await request.json();
    const { name, factionId, appearance } = body; // Example character creation data

    if (!name || !factionId) {
      return NextResponse.json({ error: 'Character name and faction ID are required.' }, { status: 400 });
    }

    // Check if character already exists for this user (optional, depends on game design)
    // const existingCharacter = await getDoc('players', userId);
    // if (existingCharacter) {
    //   return NextResponse.json({ error: 'Character already exists for this user.' }, { status: 409 });
    // }

    const newCharacterData = { // : PlayerData
      id: userId, // Using user ID as player ID
      name,
      level: 1,
      xp: 0,
      currentGHZ: 1, // Initial GHZ
      stats: { power: 100, memory: 50, firewall: 5, ghz: 5 }, // Default starting stats
      factionId,
      appearance: appearance || { primaryColor: '#FFFFFF', secondaryColor: '#000000' }, // Default appearance
      inventory: [],
      activeQuests: [],
      completedQuests: [],
      currency: { dataShards: 0 },
      createdAt: new Date().toISOString(),
    };

    // await setDoc('players', userId, newCharacterData);
    console.log(`API: Character created for user ${userId}:`, newCharacterData);

    return NextResponse.json({ message: 'Character created successfully!', character: newCharacterData }, { status: 201 });

  } catch (error: any) {
    console.error("API Character Creation Error:", error);
    return NextResponse.json({ error: 'Failed to create character.', details: error.message }, { status: 500 });
  }
}

// GET could be used to fetch character data for the authenticated user
// export async function GET(request: NextRequest) {
  // const authenticatedUser = await verifyUser(request);
  // if (!authenticatedUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // const characterData = await getDoc('players', authenticatedUser.uid);
  // if (!characterData) return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  // return NextResponse.json(characterData);
// }
