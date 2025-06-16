// src/components/QuestLog.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpenCheck, CheckCircle2, CircleDot } from "lucide-react";
// import type { PlayerQuestDoc } from '@packages/common-types/game'; // Assuming path

interface PlayerQuestDoc { // Temporary type, replace with import
  questId: string;
  status: 'active' | 'completed' | 'failed';
  progress: Record<number, number>; 
  title?: string; // Added for display
  description?: string; // Added for display
  objectives?: { description: string; currentCount: number; targetCount?: number; isCompleted: boolean }[]; // Added
}


interface QuestLogProps {
  playerId: string;
}

export default function QuestLog({ playerId }: QuestLogProps) {
  const [quests, setQuests] = useState<PlayerQuestDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch quests for the player
    // For now, using mock data
    const mockQuests: PlayerQuestDoc[] = [
      { questId: "q1", title: "Gather Data Scraps", description: "Collect 10 common data scraps.", status: "active", progress: {0: 5}, objectives: [{description: "Collect Common Data Scraps", currentCount: 5, targetCount: 10, isCompleted: false}] },
      { questId: "q2", title: "First Contact", description: "Speak to the Nexus Guide.", status: "active", progress: {0: 0}, objectives: [{description: "Speak to Nexus Guide", currentCount: 0, targetCount: 1, isCompleted: false}] },
      { questId: "q3", title: "Stabilize Anomaly", description: "Investigate the anomaly in Zone Beta.", status: "completed", progress: {0: 1}, objectives: [{description: "Investigate Anomaly", currentCount: 1, targetCount: 1, isCompleted: true}] },
    ];
    // Simulate API call
    setTimeout(() => {
      setQuests(mockQuests);
      setIsLoading(false);
    }, 1000);
  }, [playerId]);

  const activeQuests = quests.filter(q => q.status === 'active');
  const completedQuests = quests.filter(q => q.status === 'completed');

  if (isLoading) {
    return <p className="text-muted-foreground">Loading quest log...</p>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <BookOpenCheck className="h-6 w-6 text-primary" />
          Quest Journal
        </CardTitle>
        <CardDescription>Track your objectives and progress in the Quantum Nexus.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['active-quests']} className="w-full">
          <AccordionItem value="active-quests">
            <AccordionTrigger className="text-lg font-semibold">Active Quests ({activeQuests.length})</AccordionTrigger>
            <AccordionContent>
              {activeQuests.length > 0 ? (
                <ScrollArea className="h-72 pr-3">
                  <ul className="space-y-4">
                    {activeQuests.map(quest => (
                      <li key={quest.questId} className="p-3 bg-muted/50 rounded-md border">
                        <h4 className="font-semibold text-primary">{quest.title || quest.questId}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{quest.description || "No description."}</p>
                        {quest.objectives?.map((obj, idx) => (
                           <div key={idx} className="text-sm flex items-center">
                             {obj.isCompleted ? <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> : <CircleDot className="h-4 w-4 mr-2 text-yellow-500" />}
                             <span>{obj.description}: {obj.currentCount} / {obj.targetCount || 1}</span>
                           </div>
                        ))}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-sm">No active quests.</p>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="completed-quests">
            <AccordionTrigger className="text-lg font-semibold">Completed Quests ({completedQuests.length})</AccordionTrigger>
            <AccordionContent>
              {completedQuests.length > 0 ? (
                <ScrollArea className="h-48 pr-3">
                  <ul className="space-y-2">
                    {completedQuests.map(quest => (
                      <li key={quest.questId} className="p-2 bg-muted/30 rounded-md text-sm text-muted-foreground line-through">
                        {quest.title || quest.questId}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-sm">No completed quests yet.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
