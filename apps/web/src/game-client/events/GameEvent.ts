// src/game-client/events/GameEvent.ts
/**
 * Base interface for all game events used by the EventManager.
 * Each specific event should implement this interface.
 */
export interface GameEvent {
  /**
   * A unique string identifier for the type of event.
   * e.g., "ENTITY_DIED", "QUEST_COMPLETED", "PLAYER_MOVED_ZONE".
   */
  readonly type: string;

  /**
   * Timestamp when the event occurred (e.g., Date.now()).
   */
  readonly timestamp: number;

  /**
   * Optional payload containing data specific to this event instance.
   * The structure of this data should be defined by each concrete event type.
   */
  readonly data?: any;

  /**
   * Optional: The source or originator of the event.
   * This could be an entity ID, a system name, etc.
   */
  readonly source?: string;
}

/**
 * Example: A concrete event class.
 * In practice, you might have many such classes in this directory.
 *
 * export class PlayerJoinedFactionEvent implements GameEvent {
 *   public readonly type = "PLAYER_JOINED_FACTION";
 *   public readonly timestamp: number;
 *   public readonly data: { playerId: string; factionId: string; };
 *   public readonly source: string = "FactionSystem";
 *
 *   constructor(playerId: string, factionId: string) {
 *     this.timestamp = Date.now();
 *     this.data = { playerId, factionId };
 *   }
 * }
 */

console.log("Base GameEvent interface (src/game-client/events/GameEvent.ts) defined.");
