import type { AICoreDirectiveOutput, AnonymousDirectiveOutput } from '@/ai/flows/ai-core-directive'; // Assuming Anonymous types are similar or in same file

export type AIFactionName = "AICore" | "Anonymous";

export interface AIFactionState {
  name: AIFactionName;
  currentGoal: string;
  personalityTraits: string[]; // e.g., "Orderly", "Chaotic", "Adaptive"
  lastDirectiveTimestamp?: number;
  influenceLevel: number; // A metric from 0 to 100
}

export interface AIDirectiveBase {
  id: string;
  factionName: AIFactionName;
  timestamp: string; // ISO date string
  status: "active" | "overridden" | "pending_review" | "archived";
  rawOutput: AICoreDirectiveOutput | AnonymousDirectiveOutput; // Store the raw AI output
}

export interface AICoreAIDirective extends AIDirectiveBase {
  factionName: "AICore";
  directive: string; // From AICoreDirectiveOutput
  explanation?: string; // From AICoreDirectiveOutput
}

export interface AnonymousAIDirective extends AIDirectiveBase {
  factionName: "Anonymous";
  directive: string; // From AnonymousDirectiveOutput
}

export type AIDirective = AICoreAIDirective | AnonymousAIDirective;

// This type could be stored in Firestore under /aiDirectivesLog/{directiveId}
// And /aiFactionStates/{factionName}
