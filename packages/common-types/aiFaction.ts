// packages/common-types/aiFaction.ts
import type { AICoreDirectiveOutput, AnonymousDirectiveOutput } from './aiFlowTypes';

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
  explanation?: string; // From AICoreDirectiveOutput (already in rawOutput.explanation)
}

export interface AnonymousAIDirective extends AIDirectiveBase {
  factionName: "Anonymous";
  directive: string; // From AnonymousDirectiveOutput (already in rawOutput.directive)
}

export type AIDirective = AICoreAIDirective | AnonymousAIDirective;
