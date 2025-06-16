// src/components/InventoryDisplay.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Cpu, HeartPulse, SquareActivity, MemoryStick } from "lucide-react"; // Example icons
import * as LucideIcons from "lucide-react"; // For dynamic icons
// import type { ItemInstance } from '@packages/common-types/game'; // Assuming path

interface ItemInstance { // Temporary type
  instanceId: string;
  id: string;
  name: string;
  description: string;
  type: string;
  icon?: keyof typeof LucideIcons;
  quantity: number;
  stackable: boolean;
}

interface InventoryDisplayProps {
  playerId: string;
}

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  HeartPulse,
  SquareActivity,
  MemoryStick,
  Package, // Default
};


export default function InventoryDisplay({ playerId }: InventoryDisplayProps) {
  const [inventory, setInventory] = useState<ItemInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch inventory for the player
    const mockInventory: ItemInstance[] = [
      { instanceId: "1", id: "data_scrap_common", name: "Common Data Scrap", description: "Basic building block.", type: "DataScrap", icon: "Cpu", quantity: 125, stackable: true },
      { instanceId: "2", id: "health_stim_mk1", name: "Health Stim Mk1", description: "Restores Power.", type: "Consumable", icon: "HeartPulse", quantity: 5, stackable: true },
      { instanceId: "3", id: "basic_laser", name: "Basic Laser", description: "Simple energy weapon.", type: "Equipment", icon: "SquareActivity", quantity: 1, stackable: false },
      { instanceId: "4", id: "data_cluster_uncommon", name: "Uncommon Data Cluster", description: "Dense data.", type: "DataScrap", icon: "MemoryStick", quantity: 20, stackable: true },
    ];
    setTimeout(() => {
      setInventory(mockInventory);
      setIsLoading(false);
    }, 1000);
  }, [playerId]);

  if (isLoading) {
    return <p className="text-muted-foreground">Loading inventory...</p>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <Package className="h-6 w-6 text-primary" />
            Inventory
        </CardTitle>
        <CardDescription>Manage your collected items and equipment.</CardDescription>
      </CardHeader>
      <CardContent>
        {inventory.length > 0 ? (
          <ScrollArea className="h-96 pr-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {inventory.map(item => {
                const IconComponent = item.icon && LucideIcons[item.icon] ? LucideIcons[item.icon] as React.ElementType : Package;
                return (
                  <Card key={item.instanceId} className="p-3 flex flex-col items-center justify-center aspect-square hover:shadow-md transition-shadow">
                    <IconComponent className="h-8 w-8 text-accent mb-2" />
                    <p className="text-sm font-medium text-center truncate w-full" title={item.name}>{item.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground text-center py-8">Your inventory is empty.</p>
        )}
      </CardContent>
    </Card>
  );
}
