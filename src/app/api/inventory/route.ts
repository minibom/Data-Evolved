// src/app/api/inventory/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { ItemInstance } from '@packages/common-types/game'; // Assuming types are in common package

// Mock database for player inventories
const mockPlayerInventories: Record<string, ItemInstance[]> = {
  "player123": [
    { instanceId: "inst_scrap_1", id: "data_scrap_common", name: "Common Data Scrap", description: "...", type: "DataScrap", stackable: true, quantity: 150, icon: "Cpu" },
    { instanceId: "inst_stim_1", id: "health_stim_module_mk1", name: "Health Stim Module Mk1", description: "...", type: "Consumable", stackable: true, quantity: 5, icon: "HeartPulse" },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); // In real app, get from session

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
  }

  const inventory = mockPlayerInventories[playerId] || [];
  return NextResponse.json(inventory);
}

export async function POST(request: NextRequest) {
  // For adding/updating items in inventory
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); // In real app, get from session

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
  }

  try {
    const { itemId, quantityChange } = await request.json(); // quantityChange can be positive (add) or negative (remove)
    if (!itemId || typeof quantityChange !== 'number') {
      return NextResponse.json({ error: 'Item ID and quantity change are required' }, { status: 400 });
    }

    if (!mockPlayerInventories[playerId]) {
      mockPlayerInventories[playerId] = [];
    }
    
    // Simplified logic: find item or add new, then update quantity
    // In real app: check max stack, handle instance IDs properly, fetch item details from data/items.json
    console.log(`Updating inventory for ${playerId}: item ${itemId}, quantity change ${quantityChange}`);
    // ... complex inventory update logic ...

    return NextResponse.json({ message: 'Inventory updated successfully', inventory: mockPlayerInventories[playerId] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}
