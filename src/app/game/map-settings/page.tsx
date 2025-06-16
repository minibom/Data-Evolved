// /src/app/game/map-settings/page.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Loader2, Settings, Brain, Wand2 } from 'lucide-react'; // Changed icon to Wand2
import { useToast } from '@/hooks/use-toast';
import type { MapGenerationParams } from '@packages/common-types/map';
// import { apiClient } from '@/game-client/api-client'; // If using apiClient directly

const defaultParams: MapGenerationParams = {
  size: { width: 50, height: 50 },
  theme: "digital_forest",
  numZones: 1,
  resourceDensity: "medium",
  enemyDensity: "medium",
  pvpFocus: false,
  difficulty: "medium",
  requiredFeatures: [],
};


export default function MapSettingsPage() {
  const [params, setParams] = useState<MapGenerationParams>(defaultParams);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateMap = async () => {
    setIsLoading(true);
    try {
      console.log("Requesting new map with params:", params);
      const response = await fetch('/api/map-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate map. Details: " + JSON.stringify(errorData.details));
      }
      const result = await response.json();
      console.log("Map generated successfully:", result.mapId, result.mapData);
      toast({ title: "Map Generated!", description: `New realm ${result.mapId} (${result.mapData.theme}) is ready.` });
      // TODO: Trigger map loading in game client via MapGenerationSystem
      // Example: game.getSystem(MapGenerationSystem).loadGeneratedMap(result.mapData);
    } catch (error: any) {
      toast({ title: "Error Generating Map", description: error.message, variant: "destructive" });
      console.error("Map generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline flex items-center text-primary">
            <Wand2 className="mr-2 h-6 w-6" />
            Quantum Realm Weaver
          </CardTitle>
          <CardDescription>Configure parameters for a new procedurally generated game map.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="mapTheme">Map Theme</Label>
            <Select 
                value={params.theme} 
                onValueChange={(value) => setParams(p => ({ ...p, theme: value as MapGenerationParams['theme'] }))}
            >
              <SelectTrigger id="mapTheme"><SelectValue placeholder="Select a theme" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="digital_forest">Digital Forest</SelectItem>
                <SelectItem value="urban_ruin">Urban Ruin</SelectItem>
                <SelectItem value="corrupted_wasteland">Corrupted Wasteland</SelectItem>
                <SelectItem value="nexus_core">Nexus Core Complex</SelectItem>
                <SelectItem value="data_stream_caverns">Data Stream Caverns</SelectItem>
                <SelectItem value="floating_islands_of_code">Floating Islands of Code</SelectItem>
                <SelectItem value="glitched_reality_zone">Glitched Reality Zone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mapWidth">Map Width ({params.size.width})</Label>
              <Slider id="mapWidth" min={20} max={100} step={5} defaultValue={[params.size.width]} onValueChange={([val]) => setParams(p => ({ ...p, size: { ...p.size, width: val } }))} />
            </div>
            <div>
              <Label htmlFor="mapHeight">Map Height ({params.size.height})</Label>
              <Slider id="mapHeight" min={20} max={100} step={5} defaultValue={[params.size.height]} onValueChange={([val]) => setParams(p => ({ ...p, size: { ...p.size, height: val } }))} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="numZones">Number of Zones ({params.numZones})</Label>
            <Slider id="numZones" min={1} max={5} step={1} defaultValue={[params.numZones || 1]} onValueChange={([val]) => setParams(p => ({ ...p, numZones: val }))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Resource Density</Label>
              <Select value={params.resourceDensity} onValueChange={(value) => setParams(p => ({ ...p, resourceDensity: value as MapGenerationParams['resourceDensity'] }))}>
                <SelectTrigger><SelectValue placeholder="Resource density" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Enemy Density</Label>
              <Select value={params.enemyDensity} onValueChange={(value) => setParams(p => ({ ...p, enemyDensity: value as MapGenerationParams['enemyDensity'] }))}>
                <SelectTrigger><SelectValue placeholder="Enemy density" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="horde">Horde</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
           <div>
            <Label>Difficulty</Label>
             <Select value={params.difficulty} onValueChange={(value) => setParams(p => ({ ...p, difficulty: value as MapGenerationParams['difficulty'] }))}>
              <SelectTrigger><SelectValue placeholder="Map Difficulty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="nightmare">Nightmare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="pvpFocus" checked={params.pvpFocus} onCheckedChange={(checked) => setParams(p => ({ ...p, pvpFocus: checked }))} />
            <Label htmlFor="pvpFocus">PvP Focused Layout</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateMap} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
            Weave New Realm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
