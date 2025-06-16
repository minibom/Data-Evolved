"use client";

// import InventoryDisplay from "@/components/InventoryDisplay"; // Assuming this component will be built

export default function PlayerInventoryPage({ params }: { params: { playerId: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Inventory - Player: {params.playerId}</h1>
      {/* <InventoryDisplay playerId={params.playerId} /> */}
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Inventory items will be displayed here.</p>
        <p className="text-sm mt-2">Placeholder for InventoryDisplay component.</p>
      </div>
    </div>
  );
}
