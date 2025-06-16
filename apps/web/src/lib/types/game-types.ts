// apps/web/src/lib/types/game-types.ts
/**
 * This file can contain TypeScript interfaces and types that are specifically
 * relevant to the web client's view of game data or for UI components.
 * These might be subsets or transformations of the core domain models
 * defined in @packages/common-types/game.ts.
 */

// Example: A type for displaying a simplified item in a UI list
export interface UIItemDisplay {
  id: string;
  name: string;
  icon?: string; // Path to icon or Lucide icon name
  quantity?: number;
  descriptionShort?: string;
  rarityColor?: string; // e.g., 'text-green-500' for uncommon
}

// Example: Player profile data relevant for a header display
export interface PlayerHeaderProfile {
  displayName: string;
  currentGHZ: number;
  factionIcon?: string; // Icon representing player's faction
  level: number;
}

// Types for client-side representation of quests in the UI
export interface UIQuestObjective {
  text: string;
  isCompleted: boolean;
  currentProgress?: number;
  targetProgress?: number;
}

export interface UIQuest {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'failed' | 'available';
  descriptionSummary?: string;
  objectives: UIQuestObjective[];
  giverName?: string;
  isFactionQuest?: boolean;
}


console.log("Client-specific game view types (apps/web/src/lib/types/game-types.ts) loaded.");
