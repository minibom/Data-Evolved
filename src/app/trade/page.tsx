// src/app/trade/page.tsx
"use client";
// import AuctionHouseUI from "@/components/AuctionHouseUI"; // Future component

export default function TradeHubPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Fragmented Marketplace</h1>
      {/* <AuctionHouseUI /> */}
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Auction listings, direct trade requests, and market history.</p>
        <p className="text-sm mt-2">Placeholder for AuctionHouseUI component.</p>
      </div>
    </div>
  );
}
