// src/app/social/chat/page.tsx
"use client";
// import ChatWindow from "@/components/ChatWindow"; // Future component

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Nexus Chat</h1>
      {/* <ChatWindow /> */}
      <div className="p-6 bg-card border rounded-lg shadow h-[60vh] flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4 border rounded p-2">
            <p className="text-muted-foreground text-center">Chat messages will appear here.</p>
        </div>
        <input type="text" placeholder="Type your message..." className="w-full p-2 border rounded" />
        <p className="text-sm mt-2 text-muted-foreground">Placeholder for ChatWindow component.</p>
      </div>
    </div>
  );
}
