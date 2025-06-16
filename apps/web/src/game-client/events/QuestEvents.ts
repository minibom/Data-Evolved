// apps/web/src/game-client/events/QuestEvents.ts
/**
 * Defines game events related to quests.
 * Published by QuestSystem or other systems that can trigger quest updates.
 * Subscribed to by UI systems, potentially AnalyticsSystem, etc.
 */
import type { ClientGameEvent } from '@/lib/types/common-events';
// Assuming a Quest type definition exists, e.g., from @packages/common-types/game
import type { Quest } from '@packages/common-types/game';

// --- Quest Offered Event ---
export const QUEST_OFFERED_EVENT = "QUEST_OFFERED";
export interface QuestOfferedEventData {
  quest: Quest; // Full quest definition being offered
  giverId?: string; // NPC or system ID offering the quest
}
export interface QuestOfferedEvent extends ClientGameEvent {
  type: typeof QUEST_OFFERED_EVENT;
  data: QuestOfferedEventData;
}

// --- Quest Accepted Event ---
// (Already defined as QuestAcceptedClientEvent in common-events.ts, could be referenced or extended)
export const QUEST_ACCEPTED_CLIENTSIDE_EVENT = "QUEST_ACCEPTED_CLIENTSIDE"; // Example of a more specific client event
export interface QuestAcceptedClientsideEventData {
  questId: string;
  questTitle?: string;
}
export interface QuestAcceptedClientsideEvent extends ClientGameEvent {
  type: typeof QUEST_ACCEPTED_CLIENTSIDE_EVENT;
  data: QuestAcceptedClientsideEventData;
}


// --- Quest Objective Progressed Event ---
export const QUEST_OBJECTIVE_PROGRESSED_EVENT = "QUEST_OBJECTIVE_PROGRESSED";
export interface QuestObjectiveProgressedEventData {
  questId: string;
  objectiveIndex: number; // Index of the objective in the quest's objective list
  objectiveDescription: string;
  currentProgress: number;
  targetProgress: number;
}
export interface QuestObjectiveProgressedEvent extends ClientGameEvent {
  type: typeof QUEST_OBJECTIVE_PROGRESSED_EVENT;
  data: QuestObjectiveProgressedEventData;
}

// --- Quest Completed Event ---
// (Already defined as QuestCompletedClientEvent in common-events.ts)

// --- Quest Failed Event ---
export const QUEST_FAILED_EVENT = "QUEST_FAILED";
export interface QuestFailedEventData {
  questId: string;
  questTitle?: string;
  reason?: string; // e.g., "time_limit_exceeded", "objective_unreachable"
}
export interface QuestFailedEvent extends ClientGameEvent {
  type: typeof QUEST_FAILED_EVENT;
  data: QuestFailedEventData;
}

// --- Quest Abandoned Event ---
export const QUEST_ABANDONED_EVENT = "QUEST_ABANDONED";
export interface QuestAbandonedEventData {
  questId: string;
  questTitle?: string;
}
export interface QuestAbandonedEvent extends ClientGameEvent {
  type: typeof QUEST_ABANDONED_EVENT;
  data: QuestAbandonedEventData;
}

console.log("Quest-specific game events (apps/web/src/game-client/events/QuestEvents.ts) defined.");
