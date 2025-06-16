// src/components/AchievementsUI.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, Lock, CheckCircle } from "lucide-react";
// import type { Achievement } from '@packages/common-types/game'; // Define this type

interface Achievement { // Temporary type
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: string; // ISO date string
  icon?: React.ElementType; // Optional: specific icon for achievement
}

export default function AchievementsUI() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const { currentUser } = useAuth(); // To fetch player-specific achievements

  useEffect(() => {
    // Fetch achievements (all available and player's unlocked status)
    const mockAchievements: Achievement[] = [
      { id: "ach1", name: "Nexus Pioneer", description: "Entered the Quantum Nexus for the first time.", isUnlocked: true, unlockedAt: new Date().toISOString(), icon: Award },
      { id: "ach2", name: "First Byte", description: "Collected your first Data Scrap.", isUnlocked: true, unlockedAt: new Date().toISOString(), icon: CheckCircle },
      { id: "ach3", name: "GHZ Milestone", description: "Reached 10 GHZ.", isUnlocked: false, icon: Lock },
      { id: "ach4", name: "Faction Allegiance", description: "Chose a faction.", isUnlocked: false, icon: Lock },
      { id: "ach5", name: "Zone Controller", description: "Helped secure a Zone for your faction.", isUnlocked: false, icon: Lock },
    ];
    setTimeout(() => {
      setAchievements(mockAchievements);
      setIsLoading(false);
    }, 1000);
  }, []);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  if (isLoading) return <p className="text-muted-foreground">Loading achievements...</p>;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Award className="mr-2 h-6 w-6 text-primary" />
          Achievements
        </CardTitle>
        <CardDescription>
          Progress: {unlockedCount} / {totalCount} Unlocked
        </CardDescription>
      </CardHeader>
      <CardContent>
        {achievements.length > 0 ? (
          <ScrollArea className="h-[70vh] pr-3">
            <div className="space-y-3">
              {achievements.map(ach => {
                const Icon = ach.isUnlocked ? (ach.icon || CheckCircle) : Lock;
                const iconColor = ach.isUnlocked ? "text-green-500" : "text-muted-foreground";
                return (
                  <Card key={ach.id} className={`p-4 ${ach.isUnlocked ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/40'}`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-6 w-6 mt-1 ${iconColor}`} />
                      <div>
                        <h4 className={`font-semibold ${ach.isUnlocked ? 'text-green-700' : ''}`}>{ach.name}</h4>
                        <p className="text-sm text-muted-foreground">{ach.description}</p>
                        {ach.isUnlocked && ach.unlockedAt && (
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            Unlocked: {new Date(ach.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground text-center py-8">No achievements defined yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
