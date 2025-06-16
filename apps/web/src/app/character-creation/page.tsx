// @/app/character-creation/page.tsx
"use client";

// import CharacterCustomizationUI from '@/components/CharacterCustomizationUI'; // Placeholder for actual UI component
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCircle2, Palette, Save } from 'lucide-react';
import { useRouter } from 'next/navigation'; // For redirecting after creation
import { useState } from 'react';

export default function CharacterCreationPage() {
  const router = useRouter();
  const [entityName, setEntityName] = useState("DataEntity_" + Math.floor(Math.random()*10000));
  const [selectedFaction, setSelectedFaction] = useState<string | undefined>(undefined); // Store faction ID
  const [primaryColor, setPrimaryColor] = useState("#7DF9FF"); // Electric Blue from theme
  const [secondaryColor, setSecondaryColor] = useState("#D070FF"); // Cyber Purple from theme
  const [isLoading, setIsLoading] = useState(false);
  // In a real app, you'd fetch available factions from data/factions.json or an API
  const factions = [
    { id: "AICore", name: "AI Core (Nexus Points)" },
    { id: "Hacker", name: "Hackers (Shadow Decoders)" },
    // { id: "Neutral", name: "Neutral / Undecided" } // Neutral isn't a selectable starting faction, but a state
  ];

  const handleCharacterCreate = async () => {
    setIsLoading(true);
    console.log("Creating character:", { entityName, factionId: selectedFaction, appearance: { primaryColor, secondaryColor } });
    
    try {
      const response = await fetch('/api/game/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: entityName, factionId: selectedFaction, appearance: { primaryColor, secondaryColor } }),
      });

      if (response.ok) {
        // const data = await response.json();
        // console.log("Character created successfully:", data.character);
        // this.game.playerManager.setPlayerData(data.character) // Store player data in a client-side manager
        router.push('/game'); // Redirect to game or dashboard
      } else {
        const errorData = await response.json();
        console.error("Failed to create character:", errorData.error);
        // TODO: Show error toast to user
      }
    } catch (error) {
      console.error("Network or unexpected error during character creation:", error);
      // TODO: Show error toast to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
      {/* 
        This page will host the CharacterCustomizationUI component or similar logic.
        It allows players to define their initial character appearance, name, and perhaps starting faction/attributes.
      */}
       <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline flex items-center text-3xl text-primary">
            <UserCircle2 className="mr-3 h-8 w-8" />
            Manifest Your Data Entity
          </CardTitle>
          <CardDescription>Define your digital signature to venture into the Quantum Nexus.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="entityName-create">Entity Name</Label>
            <Input id="entityName-create" value={entityName} onChange={(e) => setEntityName(e.target.value)} placeholder="e.g., GlitchRunner_7" />
          </div>
          
          <div>
            <Label htmlFor="faction-select">Initial Faction Leanings</Label>
             <Select value={selectedFaction} onValueChange={setSelectedFaction}>
              <SelectTrigger id="faction-select">
                <SelectValue placeholder="Choose your path..." />
              </SelectTrigger>
              <SelectContent>
                {factions.map(faction => (
                  <SelectItem key={faction.id} value={faction.id}>{faction.name}</SelectItem>
                ))}
                 <SelectItem value="Neutral">Neutral / Undecided</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">You can officially join a faction later in the game (at 10 GHZ).</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="primaryColor-create">Primary Digital Hue</Label>
                <Input id="primaryColor-create" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10" />
            </div>
            <div>
                <Label htmlFor="secondaryColor-create">Secondary Resonance</Label>
                <Input id="secondaryColor-create" type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-10" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4 aspect-video_preview sm:aspect-square">
            <Palette className="h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Visual Representation Preview</p>
            <div 
                className="mt-4 w-24 h-24 sm:w-32 sm:h-32 border-4 rounded-full" 
                style={{ 
                borderColor: secondaryColor,
                background: `radial-gradient(circle, ${primaryColor} 30%, ${secondaryColor} 100%)`,
                }} 
            ></div>
            </div>

        </CardContent>
        <CardFooter>
          <Button onClick={handleCharacterCreate} disabled={isLoading || !entityName || !selectedFaction} className="w-full">
            {isLoading ? "Initializing..." : <><Save className="mr-2 h-4 w-4" /> Initialize Entity & Enter Nexus</>}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
