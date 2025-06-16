// src/components/GameLoader.tsx
"use client";

import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress"; // Assuming ShadCN progress component
import { BotMessageSquare, Loader2 } from "lucide-react";

export default function GameLoader() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Quantum Nexus...");

  useEffect(() => {
    const texts = [
      "Calibrating Data Streams...",
      "Compiling Reality Matrix...",
      "Synchronizing Player Entities...",
      "Booting AI Core Systems...",
      "Checking for Anomalies...",
      "Almost there..."
    ];
    let currentTextIndex = 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoadingText("Nexus Connection Established!");
          return 100;
        }
        const newProgress = prev + Math.random() * 10;
        return Math.min(newProgress, 100);
      });
      setLoadingText(texts[currentTextIndex % texts.length]);
      currentTextIndex++;
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-[9999] text-foreground">
      <BotMessageSquare className="w-24 h-24 text-primary mb-8 animate-pulse" />
      <h1 className="text-4xl font-bold font-headline mb-4 text-primary">Loading Data Evolved</h1>
      <div className="w-full max-w-md px-4">
        <Progress value={progress} className="w-full h-4 mb-2 [&>div]:bg-primary" />
        <p className="text-center text-muted-foreground font-code text-sm">{loadingText}</p>
      </div>
       {progress < 100 && <Loader2 className="w-8 h-8 text-primary animate-spin mt-8" />}
    </div>
  );
}
