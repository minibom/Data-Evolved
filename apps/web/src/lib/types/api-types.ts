// apps/web/src/lib/types/api-types.ts
/**
 * This file defines TypeScript interfaces and types for the expected request payloads
 * and response structures of your Next.js API Routes.
 * Using these types in both client-side API calls and server-side route handlers
 * helps ensure consistency and catch errors early.
 */

// Example: API types for /api/game-state
export interface SaveGameStateRequest {
  playerId: string; // Or inferred from session server-side
  currentGHZ: number;
  factionId?: string;
  // ... other relevant player data to save
  stats: { power: number; memory: number; firewall: number; ghz: number };
  inventory?: Array<{ itemId: string; quantity: number }>;
  activeQuests?: Array<{ questId: string; progress: Record<string, any> }>;
}

export interface SaveGameStateResponse {
  success: boolean;
  message: string;
  lastSaved?: string; // ISO timestamp
}

export interface LoadGameStateResponse {
  playerId: string;
  currentGHZ: number;
  factionId?: string;
  stats: { power: number; memory: number; firewall: number; ghz: number };
  inventory: Array<{ itemId:string; instanceId: string; quantity: number; name?: string; icon?:string }>;
  activeQuests: Array<{ questId: string; status: string; progress: Record<string, any>; title?: string }>;
  // ... other loaded player data
  lastSaved: string;
}

// Example: API types for /api/admin/ai-config
import type { DynamicAIConfig } from '@packages/common-types/aiConfig';
export type GetAIConfigResponse = DynamicAIConfig;
export type UpdateAIConfigRequest = Partial<DynamicAIConfig>; // Allow partial updates
export interface UpdateAIConfigResponse {
    success: boolean;
    message: string;
    config?: DynamicAIConfig;
}


// Example: API types for /api/map-generation
import type { MapGenerationParams, GeneratedMapData } from '@packages/common-types/map';
export type GenerateMapApiRequest = MapGenerationParams;
export interface GenerateMapApiResponse {
    mapId: string;
    mapData: GeneratedMapData; // Or just a success message and client fetches map by ID
    validationErrors?: string[]; // If map generation failed validation but still returns data
    message?: string; // General message
}
export interface LoadMapApiResponse {
    mapId: string;
    mapData: GeneratedMapData;
}


console.log("API Request/Response types (apps/web/src/lib/types/api-types.ts) loaded.");
