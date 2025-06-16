// src/components/ZoneMapOverview.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPinned, ShieldHalf, Zap, AlertTriangle } from "lucide-react"; // Example icons
// import type { ZoneStateDoc } from '@packages/common-types/db'; // Assuming path

interface ZoneStateDoc { // Temporary type, replace with import
  zoneId: string;
  name?: string; // Added for display
  controllingFactionId?: 'AICore' | 'Hacker' | string;
  status: 'stable' | 'contested' | 'under_attack' | 'lockdown';
  // Add other relevant fields like player count, active events, etc.
}

interface ZoneMapOverviewProps {
  zones: ZoneStateDoc[];
  isAdminView?: boolean; // To show admin-specific controls or info
  onZoneSelect?: (zoneId: string) => void;
}

export default function ZoneMapOverview({ zones, isAdminView = false, onZoneSelect }: ZoneMapOverviewProps) {
  if (!zones || zones.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="font-headline">Nexus Zone Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No zone data available or Nexus is initializing.</p>
        </CardContent>
      </Card>
    );
  }

  const getZoneStatusColor = (status: ZoneStateDoc['status']) => {
    if (status === 'stable') return 'border-green-500 bg-green-500/10';
    if (status === 'contested') return 'border-yellow-500 bg-yellow-500/10';
    if (status === 'under_attack') return 'border-red-500 bg-red-500/10';
    if (status === 'lockdown') return 'border-gray-500 bg-gray-500/10';
    return 'border-border';
  };
  
  const getFactionIcon = (factionId?: string) => {
    if (factionId === "AICore") return <ShieldHalf className="h-4 w-4 text-blue-500" />;
    if (factionId === "Hacker") return <Zap className="h-4 w-4 text-purple-500" />;
    return null;
  }


  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {zones.map(zone => (
            <Card 
                key={zone.zoneId} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${getZoneStatusColor(zone.status)}`}
                onClick={() => onZoneSelect && onZoneSelect(zone.zoneId)}
            >
                <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold flex items-center gap-1">
                        <MapPinned className="h-4 w-4 text-muted-foreground"/>
                        {zone.name || zone.zoneId}
                    </CardTitle>
                    {getFactionIcon(zone.controllingFactionId)}
                </div>
                </CardHeader>
                <CardContent className="text-xs">
                <p className="capitalize">Status: <span className={`font-medium ${
                    zone.status === 'stable' ? 'text-green-600' :
                    zone.status === 'contested' ? 'text-yellow-600' :
                    zone.status === 'under_attack' ? 'text-red-600' :
                    'text-gray-600'
                }`}>{zone.status.replace('_', ' ')}</span></p>
                {/* Add more info like player count, active event indicator */}
                {isAdminView && <p>Admin Controls Placeholder</p>}
                </CardContent>
            </Card>
            ))}
        </div>
        {isAdminView && (
            <p className="text-xs text-muted-foreground text-center">Admin view: Click zones for detailed stats and override options.</p>
        )}
    </div>
  );
}
