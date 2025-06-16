// src/game-client/events/EntityDiedEvent.ts
import type { GameEvent } from './GameEvent';
import type { Entity } from '../entities/Entity'; // Assuming Entity base class

export const ENTITY_DIED_EVENT_TYPE = "ENTITY_DIED_EVENT";

export interface EntityDiedEventData {
  entity: Entity; // The entity that died
  killer?: Entity | null; // The entity that caused the death, if applicable
  lootTableId?: string; // Optional: ID of the loot table to process
  xpValue?: number; // Optional: XP to award
}

export class EntityDiedEvent implements GameEvent {
  public readonly type = ENTITY_DIED_EVENT_TYPE;
  public readonly timestamp: number;
  public readonly data: EntityDiedEventData;
  public readonly source: string; // e.g., CombatSystem, EnvironmentalDamageSystem

  constructor(data: EntityDiedEventData, source: string = "UnknownSystem") {
    this.timestamp = Date.now();
    this.data = data;
    this.source = source;
    console.log(`Event Created: ${this.type} - Entity: ${data.entity.name} (ID: ${data.entity.id})`);
  }
}

// Example usage:
// Assuming CombatSystem has access to eventManager and entities involved
//
// class CombatSystem {
//   private eventManager: EventManager;
//   constructor(eventManager: EventManager) { this.eventManager = eventManager; }
//
//   public handleEntityDefeat(defeatedEntity: Entity, killerEntity?: Entity) {
//     // ... other logic ...
//     this.eventManager.publish(new EntityDiedEvent(
//       { entity: defeatedEntity, killer: killerEntity, lootTableId: defeatedEntity.lootTableId, xpValue: defeatedEntity.xpValue },
//       "CombatSystem"
//     ));
//   }
// }
