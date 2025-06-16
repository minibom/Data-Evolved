// src/game-client/index.ts
import { GameClient } from './core/GameClient';
import { GameLoop } from './core/GameLoop';
import { AssetManager } from './core/AssetManager';
import { InputManager } from './core/InputManager';
import { EventManager } from './core/EventManager';
import { ApiClient } from './api-client';
import { MapManager } from './world/MapManager';
import { ProceduralMapLoader } from './world/ProceduralMapLoader';
import { ZoneManager } from './world/ZoneManager';
import type { BaseScene } from './scenes/BaseScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GamePlayScene } from './scenes/GamePlayScene';

// Systems - import all as needed
import { CombatSystem } from './systems/CombatSystem';
import { InventorySystem } from './systems/InventorySystem';
import { QuestSystem } from './systems/QuestSystem';
import { RealtimeSyncSystem } from './systems/RealtimeSyncSystem';
import { PathfindingSystem } from './systems/PathfindingSystem';
import { ShopSystem } from './systems/ShopSystem';
import { CraftingSystem } from './systems/CraftingSystem';
import { ZoneControlSystem } from './systems/ZoneControlSystem';
import { PvpSystem } from './systems/PvpSystem';
import { ProtocolForkSystem } from './systems/ProtocolForkSystem';
import { SourceCodeAnomalySystem } from './systems/SourceCodeAnomalySystem';
import { MapGenerationSystem } from './systems/MapGenerationSystem';
import { NpcInteractionSystem } from './systems/NpcInteractionSystem';
import { IntelDisseminationSystem } from './systems/IntelDisseminationSystem';
import { LootSystem } from './systems/LootSystem';
import { FactionSystem } from './systems/FactionSystem';
import { GuildSystem } from './systems/GuildSystem';
import { AchievementSystem } from './systems/AchievementSystem';
import { BossRaidSystem } from './systems/BossRaidSystem';
// ... import other systems

// UI - import all as needed
// import { HealthBar } from './ui/HealthBar';
// ... import other UI elements

// Export GameClient type for use in React components
export type { GameClient } from './core/GameClient';


// This function would be called from the React component (e.g., src/app/game/page.tsx)
export function initializeGame(canvasElement: HTMLCanvasElement): GameClient {
  const gameClientInstance = new GameClient(canvasElement);
  gameClientInstance.init(); // Initialize systems and load initial scene
  // The game loop might be started by a UI element (e.g., "Start Game" button in MainMenuScene)
  // or automatically if transitioning directly to gameplay.
  // For now, we'll start it from GamePage after a brief "loading" period.
  return gameClientInstance;
}

console.log("Game Client main script (src/game-client/index.ts) updated to export initializeGame.");
