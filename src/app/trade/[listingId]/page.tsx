// src/app/trade/[listingId]/page.tsx
"use client";

export default function ItemListingPage({ params }: { params: { listingId: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Item Listing - ID: {params.listingId}</h1>
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Details of the item listing, bid options, buy now, etc.</p>
      </div>
    </div>
  );
}
