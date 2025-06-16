// src/app/guild/page.tsx
"use client";
// import GuildList from "@/components/GuildList"; // Future component

export default function GuildDirectoryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Faction Hubs / Guild Directory</h1>
      {/* <GuildList /> */}
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">List of guilds, search, and create guild options will be here.</p>
        <p className="text-sm mt-2">Placeholder for GuildList component.</p>
      </div>
    </div>
  );
}
