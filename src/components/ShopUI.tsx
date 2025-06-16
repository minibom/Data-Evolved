// src/components/ShopUI.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Cpu, ShieldAlert, HeartPulse } from "lucide-react"; // Example icons
// import type { ShopItem } from '@packages/common-types/shop'; // Or your specific item type

interface ShopItem { // Temporary type
  id: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  icon?: React.ElementType;
  category: string;
}

export default function ShopUI() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const { currentUser } = useAuth(); // To get player currency, etc.

  useEffect(() => {
    // Fetch shop items
    const mockItems: ShopItem[] = [
      { id: "item1", name: "Data Scrap Bundle", description: "100x Common Data Scraps.", price: 100, stock: 50, icon: Cpu, category: "Materials" },
      { id: "item2", name: "Mk1 Firewall Chip", description: "Basic defensive chip.", price: 250, icon: ShieldAlert, category: "Equipment" },
      { id: "item3", name: "Power Stimulant", description: "Restores 50 Power.", price: 75, stock: 100, icon: HeartPulse, category: "Consumables" },
    ];
    setTimeout(() => {
      setItems(mockItems);
      setIsLoading(false);
    }, 500);
  }, []);

  const handlePurchase = (itemId: string) => {
    console.log(`Attempting to purchase item: ${itemId}`);
    // TODO: API call to /api/shop with itemId and quantity
    // TODO: Check player currency, update inventory, update shop stock
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading shop...</p>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <ShoppingCart className="h-6 w-6 text-primary" />
          Nexus Exchange
        </CardTitle>
        <CardDescription>Acquire essential data fragments, modules, and equipment.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ScrollArea className="h-[60vh] pr-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => {
                const Icon = item.icon;
                return (
                  <Card key={item.id} className="flex flex-col">
                    <CardHeader className="flex-row gap-3 items-center pb-2">
                       {Icon && <Icon className="h-10 w-10 text-accent" />}
                       <div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription className="text-xs">{item.category}</CardDescription>
                       </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground mb-3 text-pretty min-h-[40px]">{item.description}</p>
                    </CardContent>
                    <CardContent className="mt-auto pt-0">
                       <div className="flex justify-between items-center mb-2">
                            <p className="text-lg font-semibold text-primary">{item.price} Shards</p>
                            {item.stock !== undefined && <p className="text-xs text-muted-foreground">Stock: {item.stock}</p>}
                       </div>
                      <Button onClick={() => handlePurchase(item.id)} className="w-full" disabled={item.stock === 0}>
                        {item.stock === 0 ? "Out of Stock" : "Purchase"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground text-center py-8">The shop is currently empty.</p>
        )}
      </CardContent>
    </Card>
  );
}
