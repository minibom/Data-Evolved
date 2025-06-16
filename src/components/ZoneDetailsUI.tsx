// src/components/ZoneDetailsUI.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, ShieldHalf, Zap, TrendingUp, AlertTriangle, Construction } from "lucide-react";
// import type { ZoneStateDoc } from '@packages/common-types/db'; // Assuming path

interface ZoneStateDoc { // Temporary type, replace with import
  zoneId: string;
  name?: string;
  controllingFactionId?: 'AICore' | 'Hacker' | string;
  status: 'stable' | 'contested' | 'under_attack' | 'lockdown';
  synchronizationPoints?: Record<string, number>;
  activeEvents?: string[];
  upgrades?: Record<string, number>; // upgradeId: level
  description?: string; // Added for display
}

interface ZoneDetailsUIProps {
  zoneId: string;
}

export default function ZoneDetailsUI({ zoneId }: ZoneDetailsUIProps) {
  const [zone, setZone] = useState<ZoneStateDoc | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch zone details for zoneId
    const mockZone: ZoneStateDoc = {
      zoneId: zoneId,
      name: "Alpha Nexus Core",
      description: "The central processing hub of the Alpha Quadrant, vital for AI Core operations.",
      controllingFactionId: "AICore",
      status: "stable",
      synchronizationPoints: { "AICore": 1250, "Hacker": 300 },
      activeEvents: ["data_optimization_routine"],
      upgrades: { "defense_grid_mk2": 2, "resource_node_alpha": 3 },
    };
     setTimeout(() => {
      if (zoneId === "zone_alpha_nexus_hub") setZone(mockZone); // Example
      else setZone(null);
      setIsLoading(false);
    }, 500);
  }, [zoneId]);

  if (isLoading) {
    return <p className="text-muted-foreground">Loading zone details for {zoneId}...</p>;
  }

  if (!zone) {
    return <p className="text-destructive">Zone {zoneId} not found or data unavailable.</p>;
  }

  const factionPoints = zone.synchronizationPoints || {};
  const totalPoints = Object.values(factionPoints).reduce((sum, pts) => sum + pts, 0);
  const aiCorePoints = factionPoints["AICore"] || 0;
  const hackerPoints = factionPoints["Hacker"] || 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-headline flex items-center">
                <MapPin className="h-6 w-6 text-primary mr-2" />
                {zone.name || zone.zoneId}
            </CardTitle>
            <div className={`px-2 py-1 rounded text-xs font-semibold ${
                zone.status === 'stable' ? 'bg-green-100 text-green-700' :
                zone.status === 'contested' ? 'bg-yellow-100 text-yellow-700' :
                zone.status === 'under_attack' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
            }`}>{zone.status.replace('_',' ')}</div>
        </div>
        {zone.description && <CardDescription className="pt-1">{zone.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-1 text-sm">Faction Control:</h4>
          {zone.controllingFactionId ? (
            <div className="flex items-center gap-2">
              {zone.controllingFactionId === "AICore" ? <ShieldHalf className="h-5 w-5 text-blue-500" /> : <Zap className="h-5 w-5 text-purple-500" />}
              <span className="font-medium">{zone.controllingFactionId}</span>
            </div>
          ) : <p className="text-sm text-muted-foreground">Uncontrolled</p>}
        </div>

        {totalPoints > 0 && (
          <div>
            <h4 className="font-semibold mb-1 text-sm">Synchronization Progress:</h4>
            <div className="space-y-1">
                {aiCorePoints > 0 && (
                    <div className="flex items-center text-xs">
                        <ShieldHalf className="h-4 w-4 text-blue-500 mr-1.5"/> AI Core:
                        <Progress value={(aiCorePoints/totalPoints)*100} className="w-1/2 mx-1.5 h-2 [&>div]:bg-blue-500" /> 
                        {((aiCorePoints/totalPoints)*100).toFixed(1)}%
                    </div>
                )}
                {hackerPoints > 0 && (
                     <div className="flex items-center text-xs">
                        <Zap className="h-4 w-4 text-purple-500 mr-1.5"/> Hackers:
                        <Progress value={(hackerPoints/totalPoints)*100} className="w-1/2 mx-1.5 h-2 [&>div]:bg-purple-500" /> 
                        {((hackerPoints/totalPoints)*100).toFixed(1)}%
                    </div>
                )}
            </div>
          </div>
        )}

        {zone.upgrades && Object.keys(zone.upgrades).length > 0 && (
          <div>
            <h4 className="font-semibold mb-1 text-sm">Active Upgrades:</h4>
            <ul className="list-disc list-inside text-xs text-muted-foreground">
              {Object.entries(zone.upgrades).map(([upgradeId, level]) => (
                <li key={upgradeId}>{upgradeId.replace(/_/g, ' ')} (Level {level})</li>
              ))}
            </ul>
          </div>
        )}

        {zone.activeEvents && zone.activeEvents.length > 0 && (
            <div>
                <h4 className="font-semibold mb-1 text-sm flex items-center text-yellow-600"><AlertTriangle className="h-4 w-4 mr-1"/> Active Events:</h4>
                <ul className="list-disc list-inside text-xs text-muted-foreground">
                    {zone.activeEvents.map(event => <li key={event}>{event.replace(/_/g, ' ')}</li>)}
                </ul>
            </div>
        )}

      </CardContent>
      <CardFooter className="border-t pt-4 flex gap-2">
            <Button variant="outline" className="flex-1"><TrendingUp className="mr-2 h-4 w-4"/>Contribute Resources</Button>
            <Button className="flex-1"><Construction className="mr-2 h-4 w-4"/>Manage Upgrades</Button>
            {/* Add more actions like "Initiate Assault" etc. based on player faction and zone status */}
      </CardFooter>
    </Card>
  );
}
