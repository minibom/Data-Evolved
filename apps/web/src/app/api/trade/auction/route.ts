// src/app/api/trade/auction/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { verifyUser } from '@/lib/auth/server-auth';
// import type { Item } from '@packages/common-types/game';

interface AuctionListing {
  listingId: string;
  itemId: string; // From items.json
  itemName: string; // Denormalized for display
  itemDescription?: string; // Denormalized
  itemIcon?: string; // Denormalized
  sellerId: string;
  sellerName: string; // Denormalized
  quantity: number;
  startingBid: number;
  currentBid?: number;
  currentHighestBidderId?: string;
  currentHighestBidderName?: string;
  buyoutPrice?: number;
  endTime: string; // ISO date string
  createdAt: string; // ISO date string
  factionRestriction?: 'AICore' | 'Hacker'; // Can only be bought by this faction
  status: 'active' | 'sold' | 'expired' | 'cancelled';
}

// Mock auction listings in-memory store
let mockAuctionListings: AuctionListing[] = [
    { 
        listingId: "auc_1700000000000", 
        itemId: "data_scrap_rare_x10", 
        itemName: "Rare Data Crystal (Stack of 10)", 
        itemDescription: "A concentrated bundle of rare data, highly valuable for advanced synthesis.",
        itemIcon: "Gem",
        sellerId: "player_seller_1", 
        sellerName: "NexusTraderAlpha", 
        quantity: 1, // Represents a stack of 10
        startingBid: 500, 
        currentBid: 650,
        currentHighestBidderId: "player_bidder_2",
        currentHighestBidderName: "ByteBuyer",
        buyoutPrice: 2000, 
        endTime: new Date(Date.now() + 24 * 3600000).toISOString(), // Ends in 24 hours
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), // Created 2 hours ago
        status: 'active'
    },
    { 
        listingId: "auc_1700000005000", 
        itemId: "hacker_stealth_module_t2", 
        itemName: "Advanced Hacker Stealth Module", 
        itemDescription: "Tier 2 stealth module, significantly reduces detection signature.",
        itemIcon: "Ghost",
        sellerId: "player_seller_2", 
        sellerName: "ShadowBroker", 
        quantity: 1, 
        startingBid: 1000, 
        buyoutPrice: 3500, 
        endTime: new Date(Date.now() + 12 * 3600000).toISOString(), // Ends in 12 hours
        factionRestriction: "Hacker",
        createdAt: new Date(Date.now() - 1 * 3600000).toISOString(), // Created 1 hour ago
        status: 'active'
    },
    { 
        listingId: "auc_1700000010000", 
        itemId: "aicore_defensive_protocol_mk3", 
        itemName: "AI Core Defensive Protocol Mk3", 
        itemDescription: "Top-tier defensive programming for enhanced Firewall.",
        itemIcon: "ShieldCheck",
        sellerId: "player_seller_1", 
        sellerName: "NexusTraderAlpha", 
        quantity: 1, 
        startingBid: 1200, 
        endTime: new Date(Date.now() + 48 * 3600000).toISOString(), // Ends in 48 hours
        factionRestriction: "AICore",
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // Created 30 mins ago
        status: 'active'
    },
];

export async function GET(request: NextRequest) {
  // Get all active listings or filter (e.g., by itemId, sellerId, faction)
  // In a real app, fetch from Firestore and filter/sort there.
  const { searchParams } = new URL(request.url);
  const itemIdFilter = searchParams.get('itemId');
  const factionFilter = searchParams.get('faction');
  
  let filteredListings = mockAuctionListings.filter(l => l.status === 'active' && new Date(l.endTime) > new Date());

  if (itemIdFilter) {
    filteredListings = filteredListings.filter(l => l.itemId === itemIdFilter);
  }
  if (factionFilter) {
    filteredListings = filteredListings.filter(l => !l.factionRestriction || l.factionRestriction === factionFilter);
  }

  return NextResponse.json(filteredListings.sort((a,b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())); // Sort by soonest to end
}

export async function POST(request: NextRequest) {
  // Create a new listing or place a bid/buyout
  // const user = await verifyUser(request);
  // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = { uid: "mock_user_id", displayName: "MockUser" }; // Placeholder for auth

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_listing') {
      const { itemId, itemName, itemDescription, itemIcon, quantity, startingBid, buyoutPrice, durationHours, factionRestriction } = body;
      if (!itemId || !itemName || !quantity || !startingBid || !durationHours) {
        return NextResponse.json({ error: 'Missing fields for creating listing.' }, { status: 400 });
      }
      // TODO: Validate item exists in player's inventory and remove it.

      const newListing: AuctionListing = {
        listingId: `auc_${Date.now()}`,
        itemId,
        itemName,
        itemDescription,
        itemIcon,
        sellerId: user.uid,
        sellerName: user.displayName || user.uid,
        quantity: parseInt(quantity, 10),
        startingBid: parseFloat(startingBid),
        buyoutPrice: buyoutPrice ? parseFloat(buyoutPrice) : undefined,
        endTime: new Date(Date.now() + parseInt(durationHours, 10) * 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        factionRestriction,
        status: 'active',
      };
      mockAuctionListings.unshift(newListing);
      // In real app: saveToDB(newListing) and removeFromPlayerInventory(user.uid, itemId, quantity)
      return NextResponse.json(newListing, { status: 201 });

    } else if (action === 'place_bid') {
      const { listingId, bidAmount } = body;
      const listing = mockAuctionListings.find(l => l.listingId === listingId && l.status === 'active');
      if (!listing) return NextResponse.json({ error: 'Active listing not found.' }, { status: 404 });
      if (new Date(listing.endTime) < new Date()) return NextResponse.json({ error: 'Auction has ended.' }, { status: 400 });
      if (bidAmount <= (listing.currentBid || listing.startingBid)) return NextResponse.json({ error: 'Bid amount too low.' }, { status: 400 });
      // TODO: Check if player has enough currency and hold it.

      listing.currentBid = parseFloat(bidAmount);
      listing.currentHighestBidderId = user.uid;
      listing.currentHighestBidderName = user.displayName || user.uid;
      // In real app: updateListingInDB(listing) and holdPlayerCurrency(user.uid, bidAmount)
      return NextResponse.json(listing);

    } else if (action === 'buyout') {
      const { listingId } = body;
      const listing = mockAuctionListings.find(l => l.listingId === listingId && l.status === 'active');
      if (!listing) return NextResponse.json({ error: 'Active listing not found.' }, { status: 404 });
      if (!listing.buyoutPrice) return NextResponse.json({ error: 'Listing does not have a buyout price.' }, { status: 400 });
      if (new Date(listing.endTime) < new Date()) return NextResponse.json({ error: 'Auction has ended.' }, { status: 400 });
      // TODO: Check if player has enough currency, deduct it, and give item.
      
      listing.status = 'sold';
      listing.currentBid = listing.buyoutPrice; // Mark final price
      listing.currentHighestBidderId = user.uid;
      listing.currentHighestBidderName = user.displayName || user.uid;
      // In real app: updateListingInDB(listing), transferCurrency, transferItem
      console.log(`Listing ${listingId} bought out by ${user.uid} for ${listing.buyoutPrice}`);
      return NextResponse.json(listing);
    }

    return NextResponse.json({ error: 'Invalid auction action.' }, { status: 400 });

  } catch (error: any) {
    console.error("Auction API Error:", error);
    return NextResponse.json({ error: 'Failed to process auction request', details: error.message }, { status: 500 });
  }
}
