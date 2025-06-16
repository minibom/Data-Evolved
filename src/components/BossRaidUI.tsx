// src/components/BossRaidUI.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skull, Swords, Shield, Users } from "lucide-react";
// import type { WorldBoss } from '@packages/common-types/boss'; // Or your specific boss type

interface WorldBoss { // Temporary type
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  spawnTime: string;
  activeParticipants: { playerId: string, playerName: string, damageDealt: number }[];
  description?: string;
  abilities?: string[];
}

export default function BossRaidUI() {
  const [boss, setBoss] = useState<WorldBoss | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch current boss data
    const mockBoss: WorldBoss = {
      id: "boss_glitchzilla",
      name: "Glitchzilla, Nexus Corruptor",
      description: "A colossal anomaly feeding on unstable data streams.",
      maxHp: 1000000,
      currentHp: 750000,
      spawnTime: new Date(Date.now() - 1800000).toISOString(), // Spawned 30 mins ago
      activeParticipants: [
        { playerId: "p1", playerName: "ByteBasher", damageDealt: 50000 },
        { playerId: "p2", playerName: "CodeSlinger", damageDealt: 75000 },
      ],
      abilities: ["Data Slam", "Corruption Aura", "Nexus Pulse"]
    };
    setTimeout(() => {
      setBoss(mockBoss);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleJoinRaid = () => {
    console.log("Joining raid...");
    // TODO: API call to /api/boss to join raid
  };

  const handleAttack = () => {
    const damage = Math.floor(Math.random() * 1000) + 500; // Mock damage
    console.log(`Attacking boss for ${damage} damage...`);
    // TODO: API call to /api/boss to deal damage
    if (boss) {
        setBoss(prev => prev ? {...prev, currentHp: Math.max(0, prev.currentHp - damage)} : null);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Searching for active World Bosses...</p>;
  }

  if (!boss) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="font-headline">No Active World Boss</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The Quantum Nexus is currently stable. Check back later.</p>
        </CardContent>
      </Card>
    );
  }

  const hpPercentage = (boss.currentHp / boss.maxHp) * 100;

  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center">
        <Skull className="h-16 w-16 text-destructive mx-auto mb-2" />
        <CardTitle className="text-3xl font-bold font-headline text-destructive">{boss.name}</CardTitle>
        <CardDescription className="text-base">{boss.description || "A formidable threat has emerged!"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-medium">Integrity (HP):</span>
            <span className="text-sm font-mono">{boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()}</span>
          </div>
          <Progress value={hpPercentage} className="h-4 [&>div]:bg-destructive" />
        </div>
        
        {boss.abilities && boss.abilities.length > 0 && (
            <div>
                <h4 className="font-semibold text-sm mb-1">Known Abilities:</h4>
                <ul className="list-disc list-inside text-xs text-muted-foreground">
                    {boss.abilities.map(ability => <li key={ability}>{ability}</li>)}
                </ul>
            </div>
        )}

        <div>
          <h4 className="font-semibold text-sm mb-1 flex items-center"><Users className="h-4 w-4 mr-1"/> Participants ({boss.activeParticipants.length}):</h4>
          {boss.activeParticipants.length > 0 ? (
            <ul className="text-xs text-muted-foreground max-h-20 overflow-y-auto">
              {boss.activeParticipants.map(p => <li key={p.playerId}>{p.playerName} (DMG: {p.damageDealt.toLocaleString()})</li>)}
            </ul>
          ) : <p className="text-xs text-muted-foreground">No one has engaged yet.</p>}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleJoinRaid} variant="outline" className="flex-1">
          <Shield className="mr-2 h-4 w-4"/> Join Defense Force
        </Button>
        <Button onClick={handleAttack} className="flex-1 bg-destructive hover:bg-destructive/90">
          <Swords className="mr-2 h-4 w-4"/> Attack Boss
        </Button>
      </CardFooter>
    </Card>
  );
}
