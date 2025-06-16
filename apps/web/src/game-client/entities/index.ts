// src/game-client/entities/index.ts
export * from './Entity'; // New base class
export * from './Player';
export * from './NpcAI';
export * from './EnemyAI';
export * from './Item';
export * from './WorldBoss'; // WorldBoss now likely inherits from EnemyAI, which inherits from Entity
export * from './CodeFragment';
export * from './GlitchedLoreFragment';

console.log("Game Client Entities module (src/game-client/entities/index.ts) updated with new Entity structure.");
