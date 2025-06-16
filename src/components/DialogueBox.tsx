// src/components/DialogueBox.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";

interface Dialogue {
  speaker?: string;
  text: string;
  options?: { text: string; onSelect: () => void }[];
}

interface DialogueBoxProps {
  dialogue?: Dialogue;
  onNext?: () => void; // For linear dialogues
  isVisible: boolean;
}

export default function DialogueBox({ dialogue, onNext, isVisible }: DialogueBoxProps) {
  if (!isVisible || !dialogue) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-8 flex justify-center z-50 pointer-events-none">
      <Card className="w-full max-w-2xl shadow-2xl bg-background/90 backdrop-blur-sm pointer-events-auto">
        <CardContent className="p-4 sm:p-6 space-y-3">
          {dialogue.speaker && (
            <p className="text-lg font-semibold font-headline text-primary flex items-center">
              <MessageSquareText className="h-5 w-5 mr-2" />
              {dialogue.speaker}:
            </p>
          )}
          <p className="text-base text-foreground leading-relaxedwhitespace-pre-wrap">{dialogue.text}</p>
          
          {dialogue.options && dialogue.options.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {dialogue.options.map((option, index) => (
                <Button key={index} onClick={option.onSelect} variant="outline" className="flex-1">
                  {option.text}
                </Button>
              ))}
            </div>
          )}
          
          {!dialogue.options && onNext && (
            <div className="flex justify-end pt-2">
              <Button onClick={onNext}>
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
