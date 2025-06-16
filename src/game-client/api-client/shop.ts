// src/game-client/api-client/shop.ts
import { apiClient } from './index'; // Use the configured fetchApi from index

// Define interfaces for Shop API responses if not already in common-types
// For example:
// interface ShopItem { id: string; name: string; price: number; /* ... */ }

export async function getShopItems(): Promise<any[]> { // Replace 'any' with specific ShopItem[] type
  return apiClient.fetchApi<any[]>('/shop');
}

export async function purchaseItem(playerId: string, itemId: string, quantity: number): Promise<any> { // Replace 'any'
  return apiClient.fetchApi<any>(`/shop?playerId=${playerId}`, { // Pass playerId as query param or in body as per API design
    method: 'POST',
    body: JSON.stringify({ itemId, quantity }),
  });
}

console.log("Game Client Shop API functions (src/game-client/api-client/shop.ts) loaded.");
