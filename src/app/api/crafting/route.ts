// src/app/api/crafting/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import recipesData from '@/data/recipes.json'; // Assuming you have this
// import type { Recipe } from '@packages/common-types/game'; // Or specific crafting types

// Mock recipes (simplified)
const mockRecipes = [
    { recipeId: "craft_adv_datascrap", outputItemId: "data_scrap_uncommon", outputQuantity: 1, ingredients: [{ itemId: "data_scrap_common", quantity: 10 }], requiredSkill: null },
    { recipeId: "upgrade_laser_mk2", outputItemId: "advanced_laser_emitter", outputQuantity: 1, ingredients: [{ itemId: "basic_laser_emitter", quantity: 1 }, { itemId: "data_scrap_uncommon", quantity: 5 }], requiredSkill: "weapon_modding_1" },
];

export async function GET(request: NextRequest) {
  // Could return all recipes or filter by player skills, etc.
  return NextResponse.json(mockRecipes);
}

export async function POST(request: NextRequest) {
  // Handle crafting or upgrading an item
  // Requires auth to get playerId
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); 

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 401 });
  }

  try {
    const { recipeId, upgradeItemId } = await request.json(); // recipeId for crafting, upgradeItemId for upgrades
    
    if (recipeId) {
        const recipe = mockRecipes.find(r => r.recipeId === recipeId);
        if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        // 1. Check if player has ingredients (from inventory API)
        // 2. Check if player has required skill (from player data)
        // 3. Consume ingredients
        // 4. Add output item to inventory
        console.log(`Player ${playerId} attempting to craft recipe ${recipeId}`);
        return NextResponse.json({ message: `Crafted ${recipe.outputItemId} successfully (placeholder)` });
    } else if (upgradeItemId) {
        // Similar logic for upgrades: find upgrade path, check materials, consume, give upgraded item
        console.log(`Player ${playerId} attempting to upgrade item ${upgradeItemId}`);
        return NextResponse.json({ message: `Item ${upgradeItemId} upgraded successfully (placeholder)` });
    } else {
        return NextResponse.json({ error: "Recipe ID or Upgrade Item ID required" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process crafting/upgrade request' }, { status: 500 });
  }
}
