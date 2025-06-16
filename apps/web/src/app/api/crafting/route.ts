// apps/web/src/app/api/crafting/route.ts
/**
 * API route for handling crafting and item upgrade requests.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { verifyUser } from '@/lib/auth/server-auth';
// import recipesData from '@/data/recipes.json'; // Static recipe definitions
// import itemsData from '@/data/items.json'; // Static item definitions
// import { checkPlayerInventory, consumePlayerItems, addPlayerItem } from '@/lib/db/firestore'; // Example DB functions

interface CraftingRequest {
  action: 'craft' | 'upgrade' | 'inject_code';
  recipeId?: string;      // For 'craft'
  itemIdToUpgrade?: string; // For 'upgrade'
  upgradeMaterials?: Array<{ itemId: string; quantity: number }>; // For 'upgrade'
  targetItemIdForInjection?: string; // For 'inject_code'
  codeFragmentId?: string; // For 'inject_code'
  // Player ID would typically come from session/auth
}

// Mock recipes (simplified, in real app from recipes.json or DB)
const mockRecipes: Record<string, any> = {
    "craft_uncommon_data_cluster": { outputItemId: "data_scrap_uncommon", outputQuantity: 1, ingredients: [{ itemId: "data_scrap_common", quantity: 10 }], requiredSkill: null, name: "Uncommon Data Cluster" },
    "upgrade_basic_laser_to_focused": { outputItemId: "focused_laser_emitter", outputQuantity: 1, ingredients: [{ itemId: "basic_laser_emitter", quantity: 1 }, { itemId: "data_scrap_uncommon", quantity: 5 }], requiredSkill: "WeaponSmithing_Tier1", name: "Focused Laser Emitter" },
    "inject_damage_code_to_weapon": { outputItemId: "weapon_with_damage_code", outputQuantity: 1, ingredients: [{itemId:"compatible_weapon", quantity:1}, {itemId:"damage_code_fragment_t1", quantity:1}], name: "Weapon +Damage Code"}
};
const mockItems: Record<string, any> = {
    "data_scrap_common": { name: "Common Data Scrap" },
    "data_scrap_uncommon": { name: "Uncommon Data Cluster" },
    "basic_laser_emitter": { name: "Basic Laser Emitter" },
    "focused_laser_emitter": { name: "Focused Laser Emitter" },
    "weapon_with_damage_code": { name: "Weapon with Damage Code"},
};


export async function GET(request: NextRequest) {
  // const user = await verifyUser(request);
  // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // const playerId = user.uid;
  
  // TODO: Fetch available recipes for the player based on their skills, discovered recipes, etc.
  // For now, return all mock recipes.
  // const availableRecipes = recipesData.filter(recipe => checkPlayerSkills(playerId, recipe.skillRequired));
  console.log("API /api/crafting: GET request - returning mock recipes.");
  return NextResponse.json(Object.values(mockRecipes));
}

export async function POST(request: NextRequest) {
  // const user = await verifyUser(request);
  // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // const playerId = user.uid;
  const playerId = "mock_player_id"; // Placeholder

  try {
    const body: CraftingRequest = await request.json();
    
    if (body.action === 'craft' && body.recipeId) {
        const recipe = mockRecipes[body.recipeId];
        if (!recipe) return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
        
        // 1. TODO: Check if player has required skills (fetch player data).
        // 2. TODO: Check if player has ingredients (fetch player inventory, compare with recipe.ingredients).
        // 3. TODO: Consume ingredients from player's inventory.
        // 4. TODO: Add output item (recipe.outputItemId, recipe.outputQuantity) to player's inventory.
        
        console.log(`API /api/crafting: Player ${playerId} crafting recipe ${body.recipeId} (${recipe.name}).`);
        // Mock success:
        const craftedItem = mockItems[recipe.outputItemId] || { name: recipe.outputItemId };
        return NextResponse.json({ 
            message: `Successfully crafted ${recipe.outputQuantity}x ${craftedItem.name}! (Mock)`,
            item: { itemId: recipe.outputItemId, name: craftedItem.name, quantity: recipe.outputQuantity }
        });

    } else if (body.action === 'upgrade' && body.itemIdToUpgrade && body.upgradeMaterials) {
        // Similar logic for upgrades:
        // 1. TODO: Find upgrade path/recipe for itemIdToUpgrade.
        // 2. TODO: Check materials, skills.
        // 3. TODO: Consume old item and materials.
        // 4. TODO: Add upgraded item to inventory.
        console.log(`API /api/crafting: Player ${playerId} upgrading item ${body.itemIdToUpgrade}.`);
        return NextResponse.json({ message: `Item ${body.itemIdToUpgrade} upgraded successfully! (Mock)` });

    } else if (body.action === 'inject_code' && body.targetItemIdForInjection && body.codeFragmentId) {
        // Logic for code injection:
        // 1. TODO: Check if targetItem is compatible with codeFragment.
        // 2. TODO: Check player skills if needed.
        // 3. TODO: Consume codeFragment.
        // 4. TODO: Modify targetItem's stats/abilities or create a new modified item.
        console.log(`API /api/crafting: Player ${playerId} injecting code ${body.codeFragmentId} into ${body.targetItemIdForInjection}.`);
        const injectedItem = mockItems["weapon_with_damage_code"] || { name: "Injected Item" };
        return NextResponse.json({ message: `Code injected successfully into ${body.targetItemIdForInjection}! (Mock)`, item: injectedItem });
    } else {
        return NextResponse.json({ error: "Invalid action or missing parameters for crafting request." }, { status: 400 });
    }

  } catch (error: any) {
    console.error("API /api/crafting: Error processing request:", error);
    return NextResponse.json({ error: 'Failed to process crafting/upgrade request', details: error.message }, { status: 500 });
  }
}
