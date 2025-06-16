// src/game-client/api-client/trade.ts
import { apiClient } from './index';

// Define interfaces for Trade/Auction API responses if not already in common-types
// For example:
// interface AuctionItem { /* ... */ }

export async function getAuctionListings(filters?: any): Promise<any[]> { // Replace 'any'
  // Add filter query params if needed: ?itemId=...&sellerId=...
  const queryString = filters ? new URLSearchParams(filters).toString() : '';
  return apiClient.fetchApi<any[]>(`/trade/auction?${queryString}`);
}

export async function createAuctionListing(playerId: string, listingData: any): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/trade/auction?playerId=${playerId}`, {
    method: 'POST',
    body: JSON.stringify({ action: 'create_listing', ...listingData }),
  });
}

export async function placeBidOnAuction(playerId: string, listingId: string, bidAmount: number): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/trade/auction?playerId=${playerId}`, {
    method: 'POST',
    body: JSON.stringify({ action: 'place_bid', listingId, bidAmount }),
  });
}

export async function buyoutAuction(playerId: string, listingId: string): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/trade/auction?playerId=${playerId}`, {
    method: 'POST',
    body: JSON.stringify({ action: 'buyout', listingId }),
  });
}

// Direct Trade APIs
export async function getDirectTradeOffers(playerId: string): Promise<any[]> { // Replace 'any'
    return apiClient.fetchApi<any[]>(`/trade/direct?playerId=${playerId}`);
}

export async function createDirectTradeOffer(playerId: string, offerData: any): Promise<any> { // Replace 'any'
    return apiClient.fetchApi<any>(`/trade/direct?playerId=${playerId}`, {
        method: 'POST',
        body: JSON.stringify({ action: 'create_offer', ...offerData }),
    });
}

export async function respondToDirectTradeOffer(playerId: string, offerId: string, responseStatus: 'accepted' | 'declined'): Promise<any> { // Replace 'any'
    return apiClient.fetchApi<any>(`/trade/direct?playerId=${playerId}`, {
        method: 'POST', // Could be PATCH
        body: JSON.stringify({ action: 'respond_offer', offerId, responseStatus }),
    });
}


console.log("Game Client Trade API functions (src/game-client/api-client/trade.ts) loaded.");
