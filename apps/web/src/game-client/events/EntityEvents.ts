// apps/web/src/game-client/events/EntityEvents.ts
/**
 * Defines game events specifically related to entities (Player, NPC, Enemy).
 * These events would be published by systems like CombatSystem or NpcInteractionSystem
 * and subscribed to by other systems (e.g., QuestSystem, LootSystem, UIManager).
 */
import type { ClientGameEvent } from '@/lib/types/common-events'; // Using client-side common event base
import type { Entity } from '../entities/Entity'; // Assuming base Entity class

// --- Entity Spawned Event ---
export const ENTITY_SPAWNED_EVENT = "ENTITY_SPAWNED";
export interface EntitySpawnedEventData {
  entity: Entity; // The entity that was spawned
  spawnLocation: { x: number; y: number };
}
export interface EntitySpawnedEvent extends ClientGameEvent {
  type: typeof ENTITY_SPAWNED_EVENT;
  data: EntitySpawnedEventData;
}

// --- Entity Took Damage Event ---
// This might be an extension of EntityDamagedClientEvent from common-events
// or a more detailed internal event. For now, let's assume common-events covers it.

// --- Entity Died Event ---
// This is already defined in EntityDiedEvent.ts and potentially common-events.
// We might add more specific data here if needed for client systems.

// --- Entity Changed Faction Event ---
// This is already covered by PlayerFactionChangedClientEvent in common-events.

// --- NPC Interaction Started/Ended Events ---
export const NPC_INTERACTION_STARTED_EVENT = "NPC_INTERACTION_STARTED";
export interface NpcInteractionStartedEventData {
  npc: Entity; // Assuming NpcAI extends Entity
  player: Entity; // Assuming Player extends Entity
}
export interface NpcInteractionStartedEvent extends ClientGameEvent {
  type: typeof NPC_INTERACTION_STARTED_EVENT;
  data: NpcInteractionStartedEventData;
}

export const NPC_INTERACTION_ENDED_EVENT = "NPC_INTERACTION_ENDED";
export interface NpcInteractionEndedEventData {
  npcId: string;
  playerId: string;
  outcome?: string; // e.g., "quest_accepted", "trade_completed", "dialogue_exhausted"
}
export interface NpcInteractionEndedEvent extends ClientGameEvent {
  type: typeof NPC_INTERACTION_ENDED_EVENT;
  data: NpcInteractionEndedEventData;
}


console.log("Entity-specific game events (apps/web/src/game-client/events/EntityEvents.ts) defined.");
