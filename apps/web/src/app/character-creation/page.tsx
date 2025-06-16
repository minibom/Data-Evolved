// @/app/character-creation/page.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCircle2, Palette, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { FactionData } from '@packages/common-types/faction';
import factionsData from '@/data/factions.json';

export default function CharacterCreationPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [entityName, setEntityName] = useState(currentUser?.displayName ? `${currentUser.displayName}_Entity` : "DataEntity_" + Math.floor(Math.random()*10000));
  const [selectedFactionId, setSelectedFactionId] = useState<string | undefined>(undefined);
  const [primaryColor, setPrimaryColor] = useState("#7DF9FF"); // Electric Blue from dark theme
  const [secondaryColor, setSecondaryColor] = useState("#D070FF"); // Cyber Purple from dark theme
  const [isLoading, setIsLoading] = useState(false);
  
  const availableFactions: FactionData[] = factionsData;

  const handleCharacterCreate = async () => {
    if (!currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to create a character.", variant: "destructive" });
      router.push('/auth/login?callbackUrl=/character-creation');
      return;
    }
    if (!entityName.trim()) {
        toast({ title: "Validation Error", description: "Entity Name is required.", variant: "destructive" });
        return;
    }
    if (!selectedFactionId) {
        toast({ title: "Validation Error", description: "Please select a faction alignment.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    
    const characterData = {
      uid: currentUser.uid, // Include UID
      name: entityName,
      factionId: selectedFactionId,
      appearance: { primaryColor, secondaryColor },
    };

    console.log("Creating character with data:", characterData);
    
    try {
      const response = await fetch('/api/game/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characterData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast({ title: "Entity Manifested!", description: `Welcome to the Nexus, ${entityName}!` });
        // this.game.playerManager.setPlayerData(data.character) // Store player data in a client-side manager
        router.push('/dashboard'); // Redirect to dashboard after creation
      } else {
        console.error("Failed to create character:", responseData.error || responseData.message);
        toast({ title: "Creation Failed", description: responseData.error || responseData.message || "Could not create character.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Network or unexpected error during character creation:", error);
      toast({ title: "Creation Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser && !isLoading) { // Check isLoading to prevent flash of "not logged in"
    // This case should ideally be handled by AuthProvider redirecting or page-level auth check
    router.push('/auth/login?callbackUrl=/character-creation');
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
       <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline flex items-center text-3xl text-primary">
            <UserCircle2 className="mr-3 h-8 w-8" />
            Manifest Your Data Entity
          </CardTitle>
          <CardDescription>Define your digital signature to venture into the Quantum Nexus. Your journey begins here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="entityName-create">Entity Name</Label>
            <Input id="entityName-create" value={entityName} onChange={(e) => setEntityName(e.target.value)} placeholder="e.g., GlitchRunner_7" />
          </div>
          
          <div>
            <Label htmlFor="faction-select">Initial Faction Alignment</Label>
             <Select value={selectedFactionId} onValueChange={setSelectedFactionId}>
              <SelectTrigger id="faction-select">
                <SelectValue placeholder="Choose your initial path..." />
              </SelectTrigger>
              <SelectContent>
                {availableFactions.map(faction => (
                  <SelectItem key={faction.id} value={faction.id}>{faction.name} - {faction.alignment}</SelectItem>
                ))}
                 <SelectItem value="Neutral">Neutral / Undecided</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">You can officially join a core faction later in the game (at 10 GHZ) if you start Neutral.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="primaryColor-create">Primary Digital Hue</Label>
                <Input id="primaryColor-create" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-full" />
            </div>
            <div>
                <Label htmlFor="secondaryColor-create">Secondary Resonance</Label>
                <Input id="secondaryColor-create" type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-10 w-full" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4 aspect-video_preview sm:aspect-square">
            <Palette className="h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Visual Representation Preview</p>
            <div 
                className="mt-4 w-24 h-24 sm:w-32 sm:h-32 border-4 rounded-full shadow-inner" 
                style={{ 
                  borderColor: secondaryColor,
                  background: `radial-gradient(circle, ${primaryColor} 30%, ${secondaryColor} 100%)`,
                }} 
            ></div>
            </div>

        </CardContent>
        <CardFooter>
          <Button onClick={handleCharacterCreate} disabled={isLoading || !entityName || !selectedFactionId} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Initialize Entity & Enter Nexus
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
