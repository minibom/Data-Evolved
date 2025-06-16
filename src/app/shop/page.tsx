// src/app/shop/page.tsx
"use client";
// import ShopUI from "@/components/ShopUI"; // Future component

export default function ShopPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Item Shop</h1>
      {/* <ShopUI /> */}
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Shop interface with items for sale will be displayed here.</p>
        <p className="text-sm mt-2">Placeholder for ShopUI component.</p>
      </div>
    </div>
  );
}
