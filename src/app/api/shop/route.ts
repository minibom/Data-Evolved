// src/app/api/shop/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import shopItemsData from '@/data/shop_items.json'; // Assuming you have this
// import type { ShopItem } from '@packages/common-types/shop'; // Or your specific item type

// Mock shop items for now
const mockShopItems = [
  { id: "data_scrap_common_bundle", name: "Common Data Scrap (x100)", description: "A bundle of common data.", price: 100, stock: 50, category: "materials" },
  { id: "basic_laser_emitter", name: "Basic Laser Emitter", description: "Standard issue weapon.", price: 250, stock: 10, category: "equipment" },
  { id: "health_stim_module_mk1_pack", name: "Health Stim Mk1 (x5)", description: "Pack of 5 health stims.", price: 200, stock: 30, category: "consumables" },
];


export async function GET(request: NextRequest) {
  // In a real app, fetch from Firestore or use shop_items.json
  // Potentially filter by category, etc.
  return NextResponse.json(mockShopItems);
}

export async function POST(request: NextRequest) {
  // Handle item purchase
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); // In real app, get from session

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required for purchase' }, { status: 400 });
  }
  
  try {
    const { itemId, quantity } = await request.json();
    if (!itemId || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ error: 'Valid Item ID and quantity are required' }, { status: 400 });
    }

    const itemToBuy = mockShopItems.find(item => item.id === itemId);
    if (!itemToBuy) {
      return NextResponse.json({ error: 'Item not found in shop' }, { status: 404 });
    }
    if (itemToBuy.stock < quantity) {
      return NextResponse.json({ error: 'Not enough stock available' }, { status: 400 });
    }

    // ...
    // 1. Check if player has enough currency
    // 2. Deduct currency
    // 3. Add item to player's inventory (call inventory API or service)
    // 4. Reduce shop stock (if applicable, could be dynamic)
    // ...
    console.log(`Player ${playerId} purchasing ${quantity} of ${itemId}`);

    return NextResponse.json({ message: 'Purchase successful', itemId, quantity });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process purchase' }, { status: 500 });
  }
}
