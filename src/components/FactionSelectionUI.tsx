// src/components/FactionSelectionUI.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldHalf, Zap, HelpCircle } from "lucide-react";
// import { useAuth } from '@/context/AuthContext'; // to get player GHZ and update faction
import factionsData from '@/data/factions.json'; // Assuming this is correctly populated

interface FactionInfo {
  id: string;
  name: string;
  description: string;
  lore: string;
  icon: "ShieldHalf" | "Zap" | string; // Allow string for future expansion
  startingSkills: string[];
  alignment: string;
}

interface FactionSelectionUIProps {
  currentGHZ: number; // Player's current GHZ
  onFactionSelected: (factionId: string) => void; // Callback when faction is chosen
}

export default function FactionSelectionUI({ currentGHZ, onFactionSelected }: FactionSelectionUIProps) {
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);
  const [factions, setFactions] = useState<FactionInfo[]>([]);

  useEffect(() => {
    // In a real app, factionsData might be fetched or directly imported if static
    setFactions(factionsData as FactionInfo[]);
  }, []);

  const GHZ_REQUIREMENT = 10; // As per game design

  if (currentGHZ < GHZ_REQUIREMENT) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="font-headline">Evolution Pending</CardTitle>
          <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground my-2" />
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You need to reach <span className="font-bold text-primary">{GHZ_REQUIREMENT} GHZ</span> to undergo the System Evolution Event and choose your allegiance.
          </p>
          <p className="font-bold text-lg mt-2">Current GHZ: {currentGHZ}</p>
        </CardContent>
      </Card>
    );
  }

  const getFactionIcon = (iconName: string) => {
    if (iconName === "ShieldHalf") return <ShieldHalf className="h-12 w-12 mx-auto mb-3 text-blue-500" />;
    if (iconName === "Zap") return <Zap className="h-12 w-12 mx-auto mb-3 text-purple-500" />;
    return <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-500" />;
  };


  return (
    <div className="space-y-8">
      <Card className="text-center border-primary shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline text-primary">System Evolution Event!</CardTitle>
          <CardDescription className="text-lg">
            Your Data Entity has reached {currentGHZ} GHZ. The Quantum Nexus calls upon you to choose your path.
            Your allegiance will shape your future and the fate of this digital world.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {factions.map((faction) => (
          <Card 
            key={faction.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedFactionId === faction.id ? 'border-primary ring-2 ring-primary shadow-xl' : 'border-border'}`}
            onClick={() => setSelectedFactionId(faction.id)}
          >
            <CardHeader className="text-center">
              {getFactionIcon(faction.icon)}
              <CardTitle className="font-headline text-2xl">{faction.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground min-h-[60px]">{faction.description}</p>
              <p className="text-xs border-t pt-2 mt-2"><span className="font-semibold">Lore:</span> {faction.lore}</p>
              <p className="text-xs"><span className="font-semibold">Alignment:</span> {faction.alignment}</p>
              <p className="text-xs"><span className="font-semibold">Initial Edge:</span> {faction.startingSkills.join(', ').replace(/skill_/g, '').replace(/_/g, ' ')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <CardFooter className="justify-center mt-4">
        <Button 
          size="lg" 
          onClick={() => selectedFactionId && onFactionSelected(selectedFactionId)} 
          disabled={!selectedFactionId}
          className="w-full max-w-xs text-lg py-3"
        >
          Confirm Allegiance: {factions.find(f => f.id === selectedFactionId)?.name || "Select Faction"}
        </Button>
      </CardFooter>
    </div>
  );
}
