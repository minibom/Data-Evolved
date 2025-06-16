// src/game-client/api-client/trade.ts
import type { ApiClient } from './index';
// Define CodeFragment type, ideally from @packages/common-types
type CodeFragment = any; // Placeholder

export class TradeApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async placeBid(itemId: string, amount: number): Promise<void> {
    console.log(`TradeApiClient: Placing bid of ${amount} on item ${itemId}.`);
    // Assuming an API endpoint like /api/trade/auction/bid
    await this.apiClient.callApi('/trade/auction/bid', { itemId, amount }, 'POST');
  }

  public async listFragment(fragment: CodeFragment): Promise<void> {
    console.log("TradeApiClient: Listing code fragment.", fragment);
    // Assuming an API endpoint like /api/trade/market/list
    await this.apiClient.callApi('/trade/market/list', { fragment }, 'POST');
  }

  // Get auction listings, direct trade offers (from previous implementation)
  public async getAuctionListings(filters?: any): Promise<any[]> {
    const queryString = filters ? new URLSearchParams(filters).toString() : '';
    return this.apiClient.callApi<any[]>(`/trade/auction?${queryString}`, undefined, 'GET');
  }

  public async createAuctionListing(playerId: string, listingData: any): Promise<any> {
    return this.apiClient.callApi<any>(`/trade/auction?playerId=${playerId}`, { action: 'create_listing', ...listingData }, 'POST');
  }
    
  public async buyoutAuction(playerId: string, listingId: string): Promise<any> {
    return this.apiClient.callApi<any>(`/trade/auction?playerId=${playerId}`, { action: 'buyout', listingId }, 'POST');
  }

  public async getDirectTradeOffers(playerId: string): Promise<any[]> {
      return this.apiClient.callApi<any[]>(`/trade/direct?playerId=${playerId}`, undefined, 'GET');
  }

  public async createDirectTradeOffer(playerId: string, offerData: any): Promise<any> {
      return this.apiClient.callApi<any>(`/trade/direct?playerId=${playerId}`, { action: 'create_offer', ...offerData }, 'POST');
  }

  public async respondToDirectTradeOffer(playerId: string, offerId: string, responseStatus: 'accepted' | 'declined'): Promise<any> {
      return this.apiClient.callApi<any>(`/trade/direct?playerId=${playerId}`, { action: 'respond_offer', offerId, responseStatus }, 'POST');
  }
}

console.log("TradeApiClient class (src/game-client/api-client/trade.ts) loaded.");
