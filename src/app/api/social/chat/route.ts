// src/app/api/social/chat/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock chat messages (in real app, use Firestore and possibly a pub/sub system for real-time)
interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId?: string; // For private messages
  channelId?: string; // For group/faction/global chats
  content: string;
  timestamp: string;
}
const mockChatMessages: ChatMessage[] = [];

export async function GET(request: NextRequest) {
  // Fetch messages for a specific channel or private chat
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');
  // const privateChatUserId = searchParams.get('userId');
  // ... filtering logic ...
  return NextResponse.json(mockChatMessages.filter(m => m.channelId === channelId || !channelId)); // Simplified
}

export async function POST(request: NextRequest) {
  // Send a new chat message
  // Requires auth to get senderPlayerId
  const { searchParams } = new URL(request.url);
  const senderPlayerId = searchParams.get('senderPlayerId'); 
  const senderName = searchParams.get('senderName') || "AnonymousEntity";

  if (!senderPlayerId) {
    return NextResponse.json({ error: 'Sender Player ID is required' }, { status: 401 });
  }

  try {
    const { content, channelId, receiverId } = await request.json();
    if (!content || (!channelId && !receiverId)) {
      return NextResponse.json({ error: 'Content and channel/receiver ID required' }, { status: 400 });
    }
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: senderPlayerId,
      senderName,
      content,
      channelId,
      receiverId,
      timestamp: new Date().toISOString(),
    };
    mockChatMessages.push(newMessage);
    // In real-time, you'd publish this message to subscribers
    console.log("New chat message:", newMessage);
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
