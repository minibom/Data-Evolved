// src/components/ChatWindow.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircleMore } from "lucide-react";
// import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOwnMessage?: boolean;
}

interface ChatWindowProps {
  channelId?: string; // For group/public chats
  recipientId?: string; // For private chats
}

export default function ChatWindow({ channelId, recipientId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  // const { currentUser } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock current user ID
  const currentUserId = "user123"; 

  useEffect(() => {
    // Fetch initial messages or subscribe to real-time updates
    const mockMessages: Message[] = [
      { id: "m1", senderId: "otherUser", senderName: "NexusBot", text: "Welcome to the Nexus Chat!", timestamp: new Date(Date.now() - 60000).toISOString(), isOwnMessage: false },
      { id: "m2", senderId: currentUserId, senderName: "You", text: "Hey there!", timestamp: new Date().toISOString(), isOwnMessage: true },
    ];
    setMessages(mockMessages);
  }, [channelId, recipientId, currentUserId]);
  
  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);


  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const messageToSend: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId, // currentUser?.uid || "unknownUser",
      senderName: "You", // currentUser?.displayName || "You",
      text: newMessage,
      timestamp: new Date().toISOString(),
      isOwnMessage: true,
    };
    // TODO: API call to send message via /api/social/chat
    console.log("Sending message:", messageToSend, "to channel/recipient:", channelId || recipientId);
    setMessages(prev => [...prev, messageToSend]);
    setNewMessage('');
  };

  return (
    <Card className="shadow-lg h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <MessageCircleMore className="h-6 w-6 text-primary"/>
            Chat: {channelId ? `Channel #${channelId}` : recipientId ? `With ${recipientId}` : "Global"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-2 rounded-lg ${msg.isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {!msg.isOwnMessage && <p className="text-xs font-semibold mb-0.5">{msg.senderName}</p>}
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center space-x-2">
          <Input 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow"
          />
          <Button onClick={handleSendMessage}><Send className="h-4 w-4"/></Button>
        </div>
      </CardFooter>
    </Card>
  );
}
