// apps/web/src/lib/types/common-events.ts
/**
 * This file defines TypeScript interfaces for common game events that are
 * published and subscribed to via the client-side EventManager.
 * These types help ensure consistency when systems communicate through events.
 */

// Base event structure (can be reused from game-client/events/GameEvent.ts if preferred)
// For clarity, defining a local version or importing if shared.
export interface ClientGameEvent {
  type: string; // Unique type identifier for the event
  timestamp: number;
  data?: any; // Payload associated with the event
}

// Specific event types:

export interface EntityDamagedClientEventData {
  entityId: string;
  damageAmount: number;
  newPower: number;
  attackerId?: string;
}
export interface EntityDamagedClientEvent extends ClientGameEvent {
  type: "ENTITY_DAMAGED_CLIENT";
  data: EntityDamagedClientEventData;
}

export interface EntityDiedClientEventData {
  entityId: string;
  entityName?: string;
  killerId?: string;
  lootDropped?: Array<{ itemId: string; quantity: number }>;
}
export interface EntityDiedClientEvent extends ClientGameEvent {
  type: "ENTITY_DIED_CLIENT";
  data: EntityDiedClientEventData;
}


export interface QuestAcceptedClientEventData {
  questId: string;
  questTitle?: string;
}
export interface QuestAcceptedClientEvent extends ClientGameEvent {
  type: "QUEST_ACCEPTED_CLIENT";
  data: QuestAcceptedClientEventData;
}

export interface QuestObjectiveCompletedClientEventData {
  questId: string;
  objectiveDescription: string;
}
export interface QuestObjectiveCompletedClientEvent extends ClientGameEvent {
  type: "QUEST_OBJECTIVE_COMPLETED_CLIENT";
  data: QuestObjectiveCompletedClientEventData;
}

export interface QuestCompletedClientEventData {
  questId: string;
  questTitle?: string;
  rewards: any; // Define a UIQuestReward type
}
export interface QuestCompletedClientEvent extends ClientGameEvent {
  type: "QUEST_COMPLETED_CLIENT";
  data: QuestCompletedClientEventData;
}


export interface ItemPickedUpClientEventData {
  itemId: string;
  itemName?: string;
  quantity: number;
}
export interface ItemPickedUpClientEvent extends ClientGameEvent {
  type: "ITEM_PICKED_UP_CLIENT";
  data: ItemPickedUpClientEventData;
}

export interface PlayerFactionChangedClientEventData {
  playerId: string;
  oldFactionId?: string;
  newFactionId: string;
  reason: 'choice' | 'assimilation';
}
export interface PlayerFactionChangedClientEvent extends ClientGameEvent {
  type: "PLAYER_FACTION_CHANGED_CLIENT";
  data: PlayerFactionChangedClientEventData;
}


console.log("Client-side common event types (apps/web/src/lib/types/common-events.ts) loaded.");
