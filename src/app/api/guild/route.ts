// src/app/api/guild/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import type { Guild } from '@packages/common-types/guild';

// Mock guild data store
const mockGuilds: any[] = [
    { id: "guild_alpha_core", name: "Alpha Core Protocol", description: "Defenders of the Nexus.", memberCount: 25, factionAffinity: "AICore" },
    { id: "guild_shadow_ops", name: "Shadow Operations", description: "Data liberators.", memberCount: 22, factionAffinity: "Hacker" },
];

export async function GET(request: NextRequest) {
  // Get all guilds or a specific guild by ID
  const { searchParams } = new URL(request.url);
  const guildId = searchParams.get('guildId');

  if (guildId) {
    const guild = mockGuilds.find(g => g.id === guildId);
    if (guild) return NextResponse.json(guild);
    return NextResponse.json({ error: "Guild not found" }, { status: 404 });
  }
  return NextResponse.json(mockGuilds);
}

export async function POST(request: NextRequest) {
  // Create a new guild or manage guild membership (join/leave)
  // Requires auth to get playerId
  try {
    const body = await request.json();
    // Example: create guild
    // const { name, description, factionAffinity } = body;
    // if (!name || !description) {
    //   return NextResponse.json({ error: "Guild name and description required"}, { status: 400 });
    // }
    // const newGuild = { id: `guild_${Date.now()}`, name, description, factionAffinity, memberCount: 1 };
    // mockGuilds.push(newGuild);
    // return NextResponse.json(newGuild, { status: 201 });

    console.log("Guild API POST request body:", body);
    return NextResponse.json({ message: "Guild action received (placeholder)" });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process guild request' }, { status: 500 });
  }
}
