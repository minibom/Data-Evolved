// src/game-client/api-client/trade.ts
/**
 * TradeApiClient provides methods for interacting with trade-related backend APIs,
 * including auction house operations (listing, bidding, buyout) and direct player-to-player trades.
 */
import type { ApiClient } from './index'; // Main ApiClient for making calls
// Define CodeFragment, AuctionListing, DirectTradeOffer types, ideally from @packages/common-types
// For now, using 'any' as placeholder.
type CodeFragment = any; 
type AuctionListing = any;
type DirectTradeOffer = any;
type Item = any; // Placeholder for item type if needed for listing

export class TradeApiClient {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // --- Auction House Methods ---

  /**
   * Fetches current auction listings, optionally filtered.
   * @param filters Optional query parameters for filtering listings.
   * @returns A promise that resolves with an array of auction listings.
   */
  public async getAuctionListings(filters?: any): Promise<AuctionListing[]> {
    const queryString = filters ? '?' + new URLSearchParams(filters).toString() : '';
    console.log(`TradeApiClient: Fetching auction listings with filters: ${queryString}`);
    return this.apiClient.callApi<AuctionListing[]>(`/trade/auction${queryString}`, undefined, 'GET');
  }

  /**
   * Creates a new auction listing.
   * @param playerId The ID of the player creating the listing.
   * @param listingData Data for the new listing (itemId, quantity, startBid, buyoutPrice, duration).
   * @returns A promise that resolves with the created auction listing details.
   */
  public async createAuctionListing(playerId: string, listingData: { itemId: string, quantity: number, startingBid: number, buyoutPrice?: number, durationHours?: number, factionRestriction?: string }): Promise<AuctionListing> {
    console.log(`TradeApiClient: Player ${playerId} creating auction listing:`, listingData);
    return this.apiClient.callApi<AuctionListing>(`/trade/auction?playerId=${playerId}`, { action: 'create_listing', ...listingData }, 'POST');
  }

  /**
   * Places a bid on an auction listing.
   * @param playerId The ID of the player placing the bid.
   * @param listingId The ID of the auction listing.
   * @param amount The amount to bid.
   * @returns A promise that resolves when the bid is placed.
   */
  public async placeBid(playerId: string, listingId: string, amount: number): Promise<void> {
    console.log(`TradeApiClient: Player ${playerId} placing bid of ${amount} on item ${listingId}.`);
    await this.apiClient.callApi(`/trade/auction?playerId=${playerId}`, { action: 'place_bid', listingId, bidAmount: amount }, 'POST');
  }

  /**
   * Buys out an auction listing.
   * @param playerId The ID of the player buying out the listing.
   * @param listingId The ID of the auction listing.
   * @returns A promise that resolves with details of the purchased item/transaction.
   */
  public async buyoutAuction(playerId: string, listingId: string): Promise<any> {
    console.log(`TradeApiClient: Player ${playerId} buying out listing ${listingId}.`);
    return this.apiClient.callApi<any>(`/trade/auction?playerId=${playerId}`, { action: 'buyout', listingId }, 'POST');
  }

  /**
   * Lists a CodeFragment for sale or trade.
   * This might use a different endpoint or be part of the general auction/trade system.
   * @param fragment The CodeFragment object to list.
   * @returns A promise that resolves when the fragment is listed.
   */
  public async listFragment(fragment: CodeFragment): Promise<void> {
    console.log("TradeApiClient: Listing code fragment.", fragment);
    // Assuming a specific endpoint for fragments or a way to tag items
    await this.apiClient.callApi('/trade/market/list_fragment', { fragment }, 'POST');
  }


  // --- Direct Player-to-Player Trade Methods ---

  /**
   * Fetches direct trade offers intended for or initiated by the player.
   * @param playerId The ID of the player.
   * @returns A promise that resolves with an array of direct trade offers.
   */
  public async getDirectTradeOffers(playerId: string): Promise<DirectTradeOffer[]> {
    console.log(`TradeApiClient: Fetching direct trade offers for player ${playerId}.`);
    return this.apiClient.callApi<DirectTradeOffer[]>(`/trade/direct?playerId=${playerId}`, undefined, 'GET');
  }

  /**
   * Creates a new direct trade offer to another player.
   * @param playerId The ID of the player initiating the offer.
   * @param offerData Details of the offer (targetPlayerId, itemsOffered, itemsRequested, currencyOffered, currencyRequested).
   * @returns A promise that resolves with the created trade offer details.
   */
  public async createDirectTradeOffer(playerId: string, offerData: { targetPlayerId: string, itemsOffered?: Item[], itemsRequested?: Item[], currencyOffered?: number, currencyRequested?: number }): Promise<DirectTradeOffer> {
    console.log(`TradeApiClient: Player ${playerId} creating direct trade offer:`, offerData);
    return this.apiClient.callApi<DirectTradeOffer>(`/trade/direct?playerId=${playerId}`, { action: 'create_offer', ...offerData }, 'POST');
  }

  /**
   * Responds to a direct trade offer (accept or decline).
   * @param playerId The ID of the player responding (must be the target of the offer).
   * @param offerId The ID of the trade offer.
   * @param responseStatus 'accepted' or 'declined'.
   * @returns A promise that resolves with the outcome of the response.
   */
  public async respondToDirectTradeOffer(playerId: string, offerId: string, responseStatus: 'accepted' | 'declined'): Promise<any> {
    console.log(`TradeApiClient: Player ${playerId} responding '${responseStatus}' to offer ${offerId}.`);
    return this.apiClient.callApi<any>(`/trade/direct?playerId=${playerId}`, { action: 'respond_offer', offerId, responseStatus }, 'POST');
  }
}

console.log("TradeApiClient class (src/game-client/api-client/trade.ts) created and updated.");
