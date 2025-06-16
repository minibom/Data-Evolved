// src/app/api/trade/direct/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface DirectTradeOffer {
    offerId: string;
    initiatorId: string;
    initiatorName: string;
    targetId: string;
    initiatorItems: { itemId: string, quantity: number }[];
    targetItems: { itemId: string, quantity: number }[]; // What initiator requests
    initiatorCurrency?: number;
    targetCurrency?: number; // What initiator requests
    status: 'pending' | 'accepted' | 'declined' | 'cancelled';
    createdAt: string;
}

// Mock direct trade offers
const mockDirectTradeOffers: DirectTradeOffer[] = [];

export async function POST(request: NextRequest) {
  // Create a new direct trade offer or respond to one
  // Requires auth to get playerId
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId'); 
  const playerName = searchParams.get('playerName') || "Trader";

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // Example: create offer
    // const { targetId, initiatorItems, targetItems, initiatorCurrency, targetCurrency } = body;
    // const newOffer: DirectTradeOffer = { offerId: `trade_${Date.now()}`, initiatorId: playerId, initiatorName: playerName, targetId, initiatorItems, targetItems, initiatorCurrency, targetCurrency, status: 'pending', createdAt: new Date().toISOString() };
    // mockDirectTradeOffers.push(newOffer);
    // return NextResponse.json(newOffer, { status: 201 });

    // Example: respond to offer
    // const { offerId, responseStatus } = body; // responseStatus: 'accepted' | 'declined'
    // ... find offer, validate player is target, update status, execute item/currency transfer if accepted ...

    console.log(`Direct trade action by ${playerId}:`, body);
    return NextResponse.json({ message: "Direct trade action processed (placeholder)" });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process direct trade' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Get pending trade offers for the authenticated player
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId');
  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 401 });
  }
  const playerOffers = mockDirectTradeOffers.filter(
    offer => (offer.initiatorId === playerId || offer.targetId === playerId) && offer.status === 'pending'
  );
  return NextResponse.json(playerOffers);
}
