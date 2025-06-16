// src/components/PlayerStatsDisplay.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Brain, ShieldAlert, Activity } from "lucide-react"; // Activity for GHZ

interface PlayerStats {
  power: number;
  memory: number;
  firewall: number;
  ghz: number;
}

interface PlayerStatsDisplayProps {
  stats: PlayerStats;
}

export default function PlayerStatsDisplay({ stats }: PlayerStatsDisplayProps) {
  const statItems = [
    { name: "Power (Core HP)", value: stats.power, icon: Activity, color: "text-red-500" },
    { name: "Memory (Mental HP)", value: stats.memory, icon: Brain, color: "text-blue-500" },
    { name: "Firewall (Defense)", value: stats.firewall, icon: ShieldAlert, color: "text-green-500" },
    { name: "GHZ (Processing Attack)", value: stats.ghz, icon: Zap, color: "text-yellow-500" },
  ];

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Entity Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statItems.map((item) => (
            <div key={item.name} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <item.icon className={`w-8 h-8 ${item.color}`} />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
