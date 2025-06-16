// src/components/AuctionHouseUI.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gavel, Tag, Landmark, PlusCircle } from "lucide-react"; // Example icons
// import type { AuctionListing } from '@packages/common-types/trade'; // Define this type

interface AuctionListing { // Temporary type
  listingId: string;
  itemName: string;
  currentBid?: number;
  buyoutPrice?: number;
  endTime: string;
  sellerName: string;
  quantity: number;
  factionRestriction?: string;
}

export default function AuctionHouseUI() {
  const [listings, setListings] = useState<AuctionListing[]>([]);
  const [myListings, setMyListings] = useState<AuctionListing[]>([]);
  const [myBids, setMyBids] = useState<AuctionListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch auction listings
    const mockListings: AuctionListing[] = [
      { listingId: "auc1", itemName: "Rare Data Crystal", currentBid: 1500, buyoutPrice: 5000, endTime: new Date(Date.now() + 3600000 * 5).toISOString(), sellerName: "NexusTrader", quantity: 1 },
      { listingId: "auc2", itemName: "Corrupted Core Fragment", currentBid: 800, endTime: new Date(Date.now() + 3600000 * 2).toISOString(), sellerName: "GlitchHunter", quantity: 3, factionRestriction: "Hacker" },
      { listingId: "auc3", itemName: "AI Core Shield Matrix", buyoutPrice: 2000, endTime: new Date(Date.now() + 3600000 * 10).toISOString(), sellerName: "CoreDefender", quantity: 1, factionRestriction: "AICore" },
    ];
    setTimeout(() => {
      setListings(mockListings);
      // Set mock data for myListings and myBids as well
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleBid = (listingId: string, amount: number) => {
    console.log(`Bidding ${amount} on listing ${listingId}`);
    // TODO: API call
  };

  const handleBuyout = (listingId: string) => {
    console.log(`Buying out listing ${listingId}`);
    // TODO: API call
  };
  
  const filteredListings = listings.filter(l => l.itemName.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderListingCard = (listing: AuctionListing) => (
    <Card key={listing.listingId} className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{listing.itemName} (x{listing.quantity})</CardTitle>
        <CardDescription>Seller: {listing.sellerName} | Ends: {new Date(listing.endTime).toLocaleTimeString()}</CardDescription>
        {listing.factionRestriction && <CardDescription className="text-xs text-accent">Faction: {listing.factionRestriction}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-2">
        {listing.currentBid && <p>Current Bid: <span className="font-semibold text-primary">{listing.currentBid}</span> Shards</p>}
        {listing.buyoutPrice && <p>Buyout: <span className="font-semibold text-green-600">{listing.buyoutPrice}</span> Shards</p>}
        <div className="flex gap-2">
            <Input type="number" placeholder="Bid amount" className="h-9"/>
            <Button size="sm" onClick={() => handleBid(listing.listingId, 0 /* get from input */)}>Bid</Button>
            {listing.buyoutPrice && <Button size="sm" variant="secondary" onClick={() => handleBuyout(listing.listingId)}>Buyout</Button>}
        </div>
      </CardContent>
    </Card>
  );


  if (isLoading) return <p className="text-muted-foreground">Loading marketplace...</p>;

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <Input 
                type="search" 
                placeholder="Search items..." 
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button><PlusCircle className="mr-2 h-4 w-4"/> Create Listing</Button> {/* TODO: Create listing modal */}
        </div>

      <Tabs defaultValue="browse">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse"><Gavel className="mr-2 h-4 w-4"/>Browse Listings</TabsTrigger>
          <TabsTrigger value="my-listings"><Tag className="mr-2 h-4 w-4"/>My Listings</TabsTrigger>
          <TabsTrigger value="my-bids"><Landmark className="mr-2 h-4 w-4"/>My Bids</TabsTrigger>
        </TabsList>
        <TabsContent value="browse">
          <ScrollArea className="h-[60vh] pr-2">
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {filteredListings.map(renderListingCard)}
              </div>
            ) : <p className="text-center text-muted-foreground py-8">No listings match your search or none available.</p>}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="my-listings">
          <ScrollArea className="h-[60vh] pr-2">
            {/* Placeholder for My Listings */}
            <p className="text-center text-muted-foreground py-8">Your active listings will appear here.</p>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="my-bids">
          <ScrollArea className="h-[60vh] pr-2">
            {/* Placeholder for My Bids */}
            <p className="text-center text-muted-foreground py-8">Items you are currently bidding on will appear here.</p>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
