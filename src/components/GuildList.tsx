// src/components/GuildList.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, ShieldHalf, Zap } from "lucide-react"; // Example icons
import Link from 'next/link';
// import type { Guild } from '@packages/common-types/guild'; // Or your specific guild type

interface Guild { // Temporary type
  id: string;
  name: string;
  description: string;
  memberCount: number;
  factionAffinity?: 'AICore' | 'Hacker' | string;
}

export default function GuildList() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch guilds
    const mockGuilds: Guild[] = [
      { id: "g1", name: "AI Core Sentinels", description: "Defenders of Nexus stability.", memberCount: 25, factionAffinity: "AICore" },
      { id: "g2", name: "Shadow Decoders Syndicate", description: "For data freedom!", memberCount: 18, factionAffinity: "Hacker" },
      { id: "g3", name: "Neutral Observers", description: "We watch. We wait.", memberCount: 10 },
    ];
    setTimeout(() => {
      setGuilds(mockGuilds);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredGuilds = guilds.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) {
    return <p className="text-muted-foreground">Loading guilds...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Find or Create a Faction Hub</CardTitle>
          <CardDescription>Join forces with like-minded Data Entities.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            type="search" 
            placeholder="Search for a hub..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button>Create Hub</Button> {/* TODO: Implement create guild modal/page */}
        </CardContent>
      </Card>

      {filteredGuilds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGuilds.map(guild => (
            <Card key={guild.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{guild.name}</CardTitle>
                    {guild.factionAffinity === "AICore" && <ShieldHalf className="h-6 w-6 text-blue-500" />}
                    {guild.factionAffinity === "Hacker" && <Zap className="h-6 w-6 text-purple-500" />}
                </div>
                <CardDescription className="text-xs">{guild.memberCount} members</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 h-12 overflow-hidden">{guild.description}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/guild/${guild.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">No guilds found matching your search, or no guilds exist yet.</p>
      )}
    </div>
  );
}
