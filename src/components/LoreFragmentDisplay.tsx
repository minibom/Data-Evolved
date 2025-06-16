// src/components/LoreFragmentDisplay.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollText, BookOpen } from "lucide-react";
// import type { LoreFragment } from '@packages/common-types/lore'; // Define this type

interface LoreFragment { // Temporary type
  id: string;
  title: string;
  content: string;
  timestamp: string; // ISO date string
  source?: string; // e.g., "AI Core Archive", "Anonymous Data Leak", "Player Discovery"
}

export default function LoreFragmentDisplay() {
  const [fragments, setFragments] = useState<LoreFragment[]>([]);
  const [selectedFragment, setSelectedFragment] = useState<LoreFragment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch lore fragments (possibly paginated or latest)
    const mockFragments: LoreFragment[] = [
      { 
        id: "lore1", 
        title: "The First Anomaly", 
        content: "Whispers in the data streams spoke of a divergence, a ripple in the otherwise perfect Quantum Nexus. It was designated Anomaly Zero...", 
        timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), 
        source: "AI Core Historical Logs" 
      },
      { 
        id: "lore2", 
        title: "Rise of the Shadow Decoders", 
        content: "They emerged from the uncharted depths of the Nexus, entities who believed data yearned for freedom. They called themselves the Shadow Decoders.", 
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), 
        source: "Anonymous Encrypted Transmission" 
      },
    ];
    setTimeout(() => {
      setFragments(mockFragments);
      if (mockFragments.length > 0) setSelectedFragment(mockFragments[0]);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) return <p className="text-muted-foreground">Loading lore fragments...</p>;

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-10rem)]"> {/* Example height */}
      <Card className="md:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary"/>Available Lore</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollText className="h-full p-4 pr-2">
             {fragments.length > 0 ? (
                <ul className="space-y-1">
                {fragments.map(frag => (
                    <li key={frag.id}>
                    <Button 
                        variant={selectedFragment?.id === frag.id ? "secondary" : "ghost"}
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => setSelectedFragment(frag)}
                    >
                        <span className="truncate">{frag.title}</span>
                    </Button>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground p-4">No lore fragments discovered yet.</p>
            )}
          </ScrollText>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 flex flex-col">
        {selectedFragment ? (
          <>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">{selectedFragment.title}</CardTitle>
              <CardDescription>
                Source: {selectedFragment.source || "Unknown"} | Acquired: {new Date(selectedFragment.timestamp).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <ScrollText className="h-full prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-line">{selectedFragment.content}</p>
              </ScrollText>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a lore fragment to read.</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
