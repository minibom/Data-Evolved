// src/game-client/api-client/map.ts
import { apiClient } from './index';
import type { MapGenerationParams, GeneratedMapData } from '@packages/common-types/map';

interface GenerateMapResponse {
  mapId: string;
  mapData: GeneratedMapData;
}

export async function generateNewMap(params: MapGenerationParams): Promise<GenerateMapResponse> {
  console.log("GameClient API: Requesting new map generation with params:", params);
  return apiClient.fetchApi<GenerateMapResponse>('/map-generation', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function loadGeneratedMapData(mapId: string): Promise<GeneratedMapData | null> {
  console.log(`GameClient API: Requesting map data for ID: ${mapId}`);
  try {
    // This API endpoint currently returns a placeholder; it would need to be implemented to fetch from a DB.
    const response = await apiClient.fetchApi<{ mapData: GeneratedMapData } | { message: string, error?: string }>(`/map-generation?mapId=${mapId}`);
    
    if ('mapData' in response) {
      return response.mapData;
    }
    
    console.warn(`Could not load map data for ${mapId} from API. Server said: ${(response as {message: string}).message}`);
    if ((response as {error?: string}).error) {
        console.warn(`Server error detail: ${(response as {error: string}).error}`);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching map data for ${mapId}:`, error);
    return null;
  }
}

console.log("Game Client Map API functions (src/game-client/api-client/map.ts) loaded and typed.");
