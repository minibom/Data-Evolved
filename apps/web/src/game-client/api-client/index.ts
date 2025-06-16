// src/game-client/api-client/index.ts
/**
 * ApiClient serves as the central class for making API calls from the game client
 * to the backend. It composes instances of specific API client classes,
 * each dedicated to a particular domain of the API (e.g., user, map, npc).
 */
import type { GameClient } from '../core/GameClient'; // GameClient for potential shared access or context
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
import { ShopApiClient } from './shop';
import { GuildApiClient } from './guild';
import { BossApiClient } from './boss';
import { SocialApiClient } from './social';
import { AchievementApiClient } from './achievements';
import { InventoryApiClient } from './inventory';
import { QuestApiClient } from './quest';
import { GameStateApiClient } from './gameState';


const API_BASE_URL = '/api'; // Adjust if your API is hosted elsewhere or has a prefix

/**
 * Base helper function for making API requests.
 * It handles common tasks like setting content type and parsing JSON responses/errors.
 * @param endpoint The API endpoint (e.g., '/user/profile').
 * @param options Standard RequestInit options for fetch.
 * @returns A promise that resolves with the JSON response.
 * @throws Error if the network response is not ok.
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Add any default headers like Authorization token if needed from a session manager
      // 'Authorization': `Bearer ${getAuthToken()}`,
      ...(options?.headers),
    },
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: `API request failed with status: ${response.status} ${response.statusText}`, details: "Response was not valid JSON." };
    }
    console.error("API Error:", errorData);
    throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export class ApiClient {
  public game: GameClient; // Reference to the main game client instance, if needed for context

  // Instances of specific API client classes
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
  public shop: ShopApiClient;
  public guild: GuildApiClient;
  public boss: BossApiClient;
  public social: SocialApiClient;
  public achievement: AchievementApiClient;
  public inventory: InventoryApiClient;
  public quest: QuestApiClient;
  public gameState: GameStateApiClient;
  // Add other specific clients here

  constructor(gameClient: GameClient) {
    this.game = gameClient;

    // Initialize all specific API clients, passing `this` (the ApiClient instance)
    // so they can use the shared `callApi` method.
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
    this.shop = new ShopApiClient(this);
    this.guild = new GuildApiClient(this);
    this.boss = new BossApiClient(this);
    this.social = new SocialApiClient(this);
    this.achievement = new AchievementApiClient(this);
    this.inventory = new InventoryApiClient(this);
    this.quest = new QuestApiClient(this);
    this.gameState = new GameStateApiClient(this);
    
    console.log("ApiClient initialized with all sub-clients.");
  }

  /**
   * A generic method for specific API clients to make calls.
   * @param endpoint The API endpoint path.
   * @param data Optional data to send in the request body (for POST, PUT, PATCH).
   * @param method HTTP method (defaults to 'POST' if data is provided, 'GET' otherwise).
   * @returns A promise that resolves with the API response.
   */
  public async callApi<T = any>(endpoint: string, data?: any, method?: string): Promise<T> {
    const requestMethod = method || (data ? 'POST' : 'GET');
    const options: RequestInit = { method: requestMethod };
    if (data && (requestMethod === 'POST' || requestMethod === 'PUT' || requestMethod === 'PATCH')) {
      options.body = JSON.stringify(data);
    }
    // Ensure GET requests with data use query parameters (if API designed that way)
    // This simplified callApi assumes data is for body if method allows.
    // For GET with params, construct endpoint string directly in specific client method.
    return fetchApi<T>(endpoint, options);
  }
}

// Exporting the helper too if needed directly by specific clients, though they should use this.apiClient.callApi
// This is generally not needed if specific clients are part of the ApiClient class.
// export { fetchApi }; 

console.log("Game Client API Client module (src/game-client/api-client/index.ts) structured with ApiClient class.");
