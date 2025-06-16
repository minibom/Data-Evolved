// src/game-client/api-client/map.ts
/**
 * MapApiClient provides methods for interacting with map-related backend APIs,
 * primarily focused on requesting AI-generated maps and loading map data.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
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

  /**
   * Requests the generation of a new map from the server based on provided parameters.
   * @param params Parameters for map generation (size, theme, density, etc.).
   * @returns A promise that resolves with the generated map data.
   */
  public async generateNewMap(params: MapGenerationParams): Promise<GeneratedMapData> {
    console.log("MapApiClient: Requesting new map generation with params:", params);
    // The backend API `/api/map-generation` (POST) should handle this.
    const response = await this.apiClient.callApi<GenerateMapResponse>('/map-generation', params, 'POST');
    return response.mapData; // Assuming the API returns mapData directly or within a structured response
  }

  /**
   * Loads data for an existing map by its ID.
   * @param mapId The unique identifier of the map to load.
   * @returns A promise that resolves with the map data, or null if not found.
   */
  public async loadMapData(mapId: string): Promise<GeneratedMapData | null> {
    console.log(`MapApiClient: Requesting map data for ID: ${mapId}`);
    try {
      // The backend API `/api/map-generation` (GET with mapId query param) should handle this.
      const response = await this.apiClient.callApi<{ mapData: GeneratedMapData } | { message: string, error?: string }>(
        `/map-generation?mapId=${mapId}`, 
        undefined, 
        'GET'
      );
      
      if ('mapData' in response) {
        return response.mapData;
      }
      
      console.warn(`MapApiClient: Could not load map data for ${mapId} from API. Server said: ${(response as {message: string}).message}`);
      if ((response as {error?: string}).error) {
          console.warn(`Server error detail: ${(response as {error: string}).error}`);
      }
      return null;
    } catch (error) {
      console.error(`MapApiClient: Error fetching map data for ${mapId}:`, error);
      return null;
    }
  }
}

console.log("MapApiClient class (src/game-client/api-client/map.ts) created and updated with methods.");
