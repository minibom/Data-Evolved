// src/game-client/api-client/map.ts
import { apiClient } from './index';
import type { MapGenerationParams, GeneratedMapData } from '@packages/common-types/map';

interface GenerateMapResponse {
  mapId: string;
  mapData: GeneratedMapData; // The full map data might be returned directly
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
    // The GET endpoint in api/map-generation/route.ts currently returns a placeholder.
    // This would fetch the actual map data from DB if that was implemented.
    // For now, this will likely fail or return a placeholder.
    const response = await apiClient.fetchApi<{ mapData: GeneratedMapData } | { error: string }>(`/map-generation?mapId=${mapId}`);
    if ('mapData' in response) {
      return response.mapData;
    }
    console.warn(`Could not load map data for ${mapId} from API, or map not found. Error:`, (response as {error: string}).error);
    return null;
  } catch (error) {
    console.error(`Error fetching map data for ${mapId}:`, error);
    return null;
  }
}

console.log("Game Client Map API functions (src/game-client/api-client/map.ts) loaded.");
