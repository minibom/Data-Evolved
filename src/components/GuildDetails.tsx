// src/components/GuildDetails.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ShieldHalf, Zap, LogOut, UserPlus } from "lucide-react";
// import type { Guild } from '@packages/common-types/guild'; // Or your specific guild type

interface Guild { // Temporary type
  id: string;
  name: string;
  description: string;
  memberCount: number;
  factionAffinity?: 'AICore' | 'Hacker' | string;
  members?: {id: string, name: string, role: string}[]; // Example members
}

interface GuildDetailsProps {
  guildId: string;
}

export default function GuildDetails({ guildId }: GuildDetailsProps) {
  const [guild, setGuild] = useState<Guild | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const { currentUser } = useAuth(); // To check if player is member, admin, etc.

  useEffect(() => {
    // Fetch guild details for guildId
    const mockGuild: Guild = { 
      id: guildId, 
      name: "AI Core Sentinels", 
      description: "Dedicated to preserving the integrity of the Quantum Nexus and guiding new entities. We stand for order and stability.",
      memberCount: 25, 
      factionAffinity: "AICore",
      members: [
        {id: "mem1", name: "NexusPrime", role: "Leader"},
        {id: "mem2", name: "StabilizerUnit7", role: "Officer"},
        {id: "mem3", name: "DataFlowAnalyst", role: "Member"},
      ]
    };
    setTimeout(() => {
      if (guildId === "g1") setGuild(mockGuild); // Simulate finding one guild
      else setGuild(null) // Simulate not found for other IDs for now
      setIsLoading(false);
    }, 500);
  }, [guildId]);

  if (isLoading) {
    return <p className="text-muted-foreground">Loading guild details...</p>;
  }

  if (!guild) {
    return <p className="text-destructive">Guild not found.</p>;
  }

  const isMember = guild.members?.some(m => m.id === "currentUserMockId"); // Replace with actual check

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-headline flex items-center">
                {guild.factionAffinity === "AICore" && <ShieldHalf className="h-7 w-7 text-blue-500 mr-2" />}
                {guild.factionAffinity === "Hacker" && <Zap className="h-7 w-7 text-purple-500 mr-2" />}
                {guild.name}
            </CardTitle>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Members: {guild.memberCount}</p>
                {guild.factionAffinity && <p className="text-xs text-muted-foreground">Affinity: {guild.factionAffinity}</p>}
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-base">{guild.description}</CardDescription>
        
        <div>
            <h3 className="font-semibold mb-2 text-lg">Members</h3>
            <ul className="space-y-1 text-sm max-h-60 overflow-y-auto p-2 border rounded-md bg-muted/30">
                {guild.members?.map(member => (
                    <li key={member.id} className="flex justify-between">
                        <span>{member.name}</span>
                        <span className="text-muted-foreground">{member.role}</span>
                    </li>
                ))}
            </ul>
        </div>
        {/* Add more sections: announcements, guild bank, upgrades etc. */}
      </CardContent>
      <CardFooter className="border-t pt-4">
        {isMember ? (
            <Button variant="destructive" className="w-full">
                <LogOut className="mr-2 h-4 w-4" /> Leave Hub
            </Button>
        ) : (
            <Button className="w-full">
                <UserPlus className="mr-2 h-4 w-4" /> Join Hub
            </Button>
        )}
        {/* Add admin controls if player has permission */}
      </CardFooter>
    </Card>
  );
}
