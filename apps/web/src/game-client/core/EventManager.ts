// src/game-client/core/EventManager.ts
/**
 * EventManager provides a global publish/subscribe system for game events.
 * This helps in decoupling different game systems and entities.
 *
 * - Systems can publish events (e.g., CombatSystem publishes EntityDiedEvent).
 * - Other systems or UI elements can subscribe to specific event types
 *   and react accordingly (e.g., QuestSystem listens for EntityDiedEvent
 *   to update kill quests, LootSystem listens to drop items).
 */

type EventListener = (event: GameEvent) => void;

interface GameEvent {
  type: string; // Unique type identifier for the event
  timestamp: number;
  data?: any; // Payload associated with the event
}

export class EventManager {
  private listeners: Map<string, EventListener[]> = new Map();

  constructor() {
    console.log("EventManager initialized.");
  }

  /**
   * Subscribes a listener function to a specific event type.
   * @param eventType The type of event to listen for.
   * @param listener The callback function to execute when the event is published.
   */
  public subscribe(eventType: string, listener: EventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(listener);
    // console.log(`Listener subscribed to event type: ${eventType}`);
  }

  /**
   * Unsubscribes a listener function from a specific event type.
   * @param eventType The type of event the listener was subscribed to.
   * @param listener The callback function to remove.
   */
  public unsubscribe(eventType: string, listener: EventListener): void {
    const eventListeners = this.listeners.get(eventType);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
        // console.log(`Listener unsubscribed from event type: ${eventType}`);
      }
    }
  }

  /**
   * Publishes an event, notifying all subscribed listeners for that event type.
   * @param event The GameEvent object to publish.
   */
  public publish(event: GameEvent): void {
    // console.log(`Publishing event: ${event.type}`, event.data);
    const eventListeners = this.listeners.get(event.type);
    if (eventListeners) {
      // Iterate over a copy in case listeners modify the array (e.g., unsubscribe themselves)
      [...eventListeners].forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in event listener for ${event.type}:`, error);
          // Optionally, remove faulty listeners or implement more robust error handling
        }
      });
    }
  }

  /**
   * Clears all listeners for a specific event type or all listeners if no type is provided.
   * @param eventType Optional. The type of event to clear listeners for.
   */
  public clearListeners(eventType?: string): void {
    if (eventType) {
      this.listeners.delete(eventType);
      console.log(`Cleared all listeners for event type: ${eventType}`);
    } else {
      this.listeners.clear();
      console.log("Cleared all event listeners.");
    }
  }
}

// Example usage (typically in other systems or entities):
//
// import { GameEvent } from './events/GameEvent'; // Assuming GameEvent base class/interface
//
// // Define a specific event type
// interface EntityDamagedEventData { entityId: string; damageAmount: number; attackerId?: string; }
// class EntityDamagedEvent implements GameEvent {
//   public readonly type = "ENTITY_DAMAGED";
//   public readonly timestamp: number;
//   public readonly data: EntityDamagedEventData;
//
//   constructor(data: EntityDamagedEventData) {
//     this.timestamp = Date.now();
//     this.data = data;
//   }
// }
//
// // In CombatSystem:
// // this.eventManager.publish(new EntityDamagedEvent({ entityId: target.id, damageAmount: 10 }));
//
// // In UI System or Quest System:
// // this.eventManager.subscribe("ENTITY_DAMAGED", (event: GameEvent) => {
// //   const eventData = event.data as EntityDamagedEventData;
// //   console.log(`Entity ${eventData.entityId} took ${eventData.damageAmount} damage.`);
// //   // Update UI health bar or quest objective
// // });

console.log("EventManager class (src/game-client/core/EventManager.ts) loaded.");
