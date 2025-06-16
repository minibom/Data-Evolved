// src/game-client/events/index.ts
/**
 * This file serves as a central export point for all game event types
 * and potentially the EventManager itself if it's not part of core.
 */

export * from './GameEvent';
export * from './EntityDiedEvent';
// Add exports for other specific game events as they are created, e.g.:
// export * from './PlayerMovedZoneEvent';
// export * from './QuestCompletedEvent';
// export * from './ItemPickedUpEvent';

console.log("Game Client Events module (src/game-client/events/index.ts) loaded.");
