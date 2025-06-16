// src/game-client/api-client/map.ts
import type { ApiClient } from './index';
import type { MapGenerationParams, GeneratedMapData } from '@packages/common-types/map';

interface GenerateMapResponse {
  mapId: string;
  mapData: GeneratedMapData;
}

export class MapApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async generateNewMap(params: MapGenerationParams): Promise<GeneratedMapData> {
    console.log("MapApiClient: Requesting new map generation with params:", params);
    const response = await this.apiClient.callApi<GenerateMapResponse>('/map-generation', params, 'POST');
    return response.mapData;
  }

  public async loadMapData(mapId: string): Promise<GeneratedMapData | null> {
    console.log(`MapApiClient: Requesting map data for ID: ${mapId}`);
    try {
      // This API endpoint currently returns a placeholder; it would need to be implemented to fetch from a DB.
      const response = await this.apiClient.callApi<{ mapData: GeneratedMapData } | { message: string, error?: string }>(`/map-generation?mapId=${mapId}`, undefined, 'GET');
      
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
}

console.log("MapApiClient class (src/game-client/api-client/map.ts) loaded and typed.");
