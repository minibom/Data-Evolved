// src/components/CraftingUI.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // For quantity if needed
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hammer, Zap, Wand2 } from "lucide-react"; // Example icons
// import type { Recipe } from '@packages/common-types/crafting'; // Define this type

interface Ingredient {
  itemId: string;
  itemName: string; // Denormalized
  quantityRequired: number;
  quantityOwned: number; // For UI display
}
interface Recipe {
  id: string;
  name: string;
  description: string;
  outputItemId: string;
  outputItemName: string; // Denormalized
  outputQuantity: number;
  ingredients: Ingredient[];
  skillRequired?: string; // e.g., "Engineering Lv. 5"
  icon?: React.ElementType;
}

export default function CraftingUI() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const { currentUser } = useAuth(); // To check skills, inventory

  useEffect(() => {
    // Fetch available recipes based on player skills/discoveries
    const mockRecipes: Recipe[] = [
      { 
        id: "r1", name: "Uncommon Data Cluster", outputItemId: "data_cluster_u", outputItemName: "Uncommon Data Cluster", outputQuantity: 1,
        description: "Combine common data scraps into a more potent cluster.",
        ingredients: [{ itemId: "data_scrap_c", itemName: "Common Data Scrap", quantityRequired: 10, quantityOwned: 150 }], // Mock owned quantity
        icon: Zap,
      },
      { 
        id: "r2", name: "Advanced Laser Emitter", outputItemId: "laser_adv", outputItemName: "Adv. Laser Emitter", outputQuantity: 1,
        description: "Upgrade a basic laser with uncommon data.",
        ingredients: [
          { itemId: "laser_basic", itemName: "Basic Laser Emitter", quantityRequired: 1, quantityOwned: 1 },
          { itemId: "data_cluster_u", itemName: "Uncommon Data Cluster", quantityRequired: 3, quantityOwned: 5 }
        ],
        skillRequired: "Weapon Modding Tier 1",
        icon: Wand2,
      },
    ];
    setTimeout(() => {
      setRecipes(mockRecipes);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCraft = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    // Check if player has enough ingredients and required skill
    const canCraft = recipe.ingredients.every(ing => ing.quantityOwned >= ing.quantityRequired);
    if (canCraft) {
      console.log(`Crafting: ${recipe.name}`);
      // TODO: API Call to /api/crafting
    } else {
      console.error("Cannot craft: Insufficient materials or skill.");
      // TODO: Show toast error
    }
  };

  if (isLoading) return <p className="text-muted-foreground">Loading crafting recipes...</p>;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">Craftable Items</CardTitle>
          <CardDescription>Select an item to craft.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <ul className="space-y-1 pr-3">
              {recipes.map(recipe => (
                <li key={recipe.id}>
                  <Button 
                    variant={selectedRecipe?.id === recipe.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    {recipe.icon && <recipe.icon className="mr-2 h-4 w-4"/>}
                    {recipe.name}
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Hammer className="mr-2 h-6 w-6 text-primary" />
            Crafting Details
          </CardTitle>
          {!selectedRecipe && <CardDescription>Select a recipe to see details.</CardDescription>}
        </CardHeader>
        {selectedRecipe && (
          <CardContent className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">{selectedRecipe.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedRecipe.description}</p>
            <p className="text-sm">Output: {selectedRecipe.outputQuantity}x {selectedRecipe.outputItemName}</p>
            {selectedRecipe.skillRequired && <p className="text-sm text-accent">Requires: {selectedRecipe.skillRequired}</p>}
            
            <div>
              <h4 className="font-medium mb-1">Ingredients:</h4>
              <ul className="space-y-1 text-sm">
                {selectedRecipe.ingredients.map(ing => (
                  <li key={ing.itemId} className={`flex justify-between ${ing.quantityOwned < ing.quantityRequired ? 'text-destructive' : ''}`}>
                    <span>{ing.itemName}</span>
                    <span>{ing.quantityOwned} / {ing.quantityRequired}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button 
                className="w-full" 
                onClick={() => handleCraft(selectedRecipe.id)}
                disabled={!selectedRecipe.ingredients.every(ing => ing.quantityOwned >= ing.quantityRequired)} // Basic check
            >
                Craft Item
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
