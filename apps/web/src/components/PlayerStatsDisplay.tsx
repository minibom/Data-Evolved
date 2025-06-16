// src/components/PlayerStatsDisplay.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Brain, ShieldAlert, Activity, Cpu } from "lucide-react"; // Added Cpu for GHZ consistency in some contexts

interface PlayerStats {
  power: number;    // Core HP -> Activity
  memory: number;   // Mental HP / Skill resource -> Brain
  firewall: number; // Defense -> ShieldAlert
  ghz: number;      // Attack / Processing Speed -> Zap
}

interface PlayerStatsDisplayProps {
  stats: PlayerStats;
}

export default function PlayerStatsDisplay({ stats }: PlayerStatsDisplayProps) {
  const statItems = [
    { name: "Power (Core Energy)", value: stats.power, icon: Activity, color: "text-red-500" },
    { name: "Memory (Cognitive Capacity)", value: stats.memory, icon: Brain, color: "text-blue-500" },
    { name: "Firewall (System Defense)", value: stats.firewall, icon: ShieldAlert, color: "text-green-500" },
    { name: "GHZ (Processing Frequency / Attack)", value: stats.ghz, icon: Zap, color: "text-yellow-500" },
  ];

  return (
    <Card className="shadow-lg w-full bg-card">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Entity Statistics Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {statItems.map((item) => (
            <div key={item.name} className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <item.icon className={`w-10 h-10 ${item.color} flex-shrink-0`} />
              <div className="flex-grow">
                <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
                <p className="text-3xl font-bold text-foreground font-code">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
