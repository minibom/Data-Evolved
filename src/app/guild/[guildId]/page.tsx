// src/app/guild/[guildId]/page.tsx
"use client";
// import GuildDetails from "@/components/GuildDetails"; // Future component

export default function GuildDetailsPage({ params }: { params: { guildId: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Guild Details - ID: {params.guildId}</h1>
      {/* <GuildDetails guildId={params.guildId} /> */}
       <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Detailed information about the guild, members, and management tools.</p>
        <p className="text-sm mt-2">Placeholder for GuildDetails component.</p>
      </div>
    </div>
  );
}
