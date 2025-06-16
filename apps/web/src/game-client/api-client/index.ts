// src/game-client/api-client/index.ts
import type { GameClient } from '../index';
import { UserApiClient } from './user';
import { MapApiClient } from './map';
import { NpcApiClient } from './npc';
import { IntelApiClient } from './intel';
import { TradeApiClient } from './trade';
import { CraftingApiClient } from './crafting';
import { ZoneApiClient } from './zone';
import { PvpApiClient } from './pvp';
import { ProtocolForkApiClient } from './protocolFork';
import { AnomalyDungeonApiClient } from './anomalyDungeon';
// Import other specific API clients as they are created

const API_BASE_URL = '/api'; // Adjust if your API is hosted elsewhere or has a prefix

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'API request failed with status: ' + response.status }));
    throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export class ApiClient {
  public game: GameClient; // Reference to the main game client instance
  public user: UserApiClient;
  public map: MapApiClient;
  public npc: NpcApiClient;
  public intel: IntelApiClient;
  public trade: TradeApiClient;
  public crafting: CraftingApiClient;
  public zone: ZoneApiClient;
  public pvp: PvpApiClient;
  public protocolFork: ProtocolForkApiClient;
  public anomalyDungeon: AnomalyDungeonApiClient;
  // Add other specific clients here

  constructor(gameClient: GameClient) {
    this.game = gameClient;
    this.user = new UserApiClient(this);
    this.map = new MapApiClient(this);
    this.npc = new NpcApiClient(this);
    this.intel = new IntelApiClient(this);
    this.trade = new TradeApiClient(this);
    this.crafting = new CraftingApiClient(this);
    this.zone = new ZoneApiClient(this);
    this.pvp = new PvpApiClient(this);
    this.protocolFork = new ProtocolForkApiClient(this);
    this.anomalyDungeon = new AnomalyDungeonApiClient(this);
    // Initialize other clients
    console.log("ApiClient initialized with all sub-clients.");
  }

  public async callApi<T = any>(endpoint: string, data?: any, method: string = 'POST'): Promise<T> {
    const options: RequestInit = { method };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return fetchApi<T>(endpoint, options);
  }
}

// Exporting the helper too if needed directly by specific clients, though they should use this.apiClient.callApi
export { fetchApi };
console.log("Game Client API Client module (src/game-client/api-client/index.ts) loaded and structured.");
