// src/components/FriendsList.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, UserCheck, UserX, UserCog, MessageSquare } from "lucide-react";
// import type { FriendEntry } from '@packages/common-types/social'; // Define this type

interface Friend {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'ingame';
  faction?: string;
}
interface FriendRequest {
  id: string;
  name: string;
  type: 'incoming' | 'outgoing';
}

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [addFriendInput, setAddFriendInput] = useState('');
  // const { currentUser } = useAuth();

  useEffect(() => {
    // Mock data fetching
    setFriends([
      { id: "f1", name: "NexusWalker", status: "online", faction: "AICore" },
      { id: "f2", name: "GlitchByte", status: "ingame", faction: "Hacker" },
      { id: "f3", name: "DataStreamRider", status: "offline" },
    ]);
    setRequests([
      { id: "r1", name: "NewbEntity", type: "incoming" },
      { id: "r2", name: "TargetUserX", type: "outgoing" },
    ]);
  }, []);

  const handleAddFriend = () => {
    if (!addFriendInput.trim()) return;
    console.log(`Sending friend request to: ${addFriendInput}`);
    // TODO: API Call to send friend request
    setAddFriendInput('');
  };
  
  const handleRequestAction = (requestId: string, action: 'accept' | 'decline' | 'cancel') => {
    console.log(`${action}ing request: ${requestId}`);
    // TODO: API call to handle request
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Add New Friend</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            placeholder="Enter Data Entity ID or Name" 
            value={addFriendInput}
            onChange={(e) => setAddFriendInput(e.target.value)}
          />
          <Button onClick={handleAddFriend}><UserPlus className="mr-2 h-4 w-4" /> Send Request</Button>
        </CardContent>
      </Card>

      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {requests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                <span>{req.name} ({req.type})</span>
                <div className="space-x-2">
                  {req.type === 'incoming' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleRequestAction(req.id, 'accept')}><UserCheck className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRequestAction(req.id, 'decline')}><UserX className="h-4 w-4" /></Button>
                    </>
                  )}
                  {req.type === 'outgoing' && (
                     <Button size="sm" variant="ghost" onClick={() => handleRequestAction(req.id, 'cancel')}>Cancel</Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Friend List ({friends.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length > 0 ? (
            <ul className="space-y-2">
              {friends.map(friend => (
                <li key={friend.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors">
                  <div>
                    <span className="font-medium">{friend.name}</span>
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      friend.status === 'online' ? 'bg-green-500/20 text-green-700' :
                      friend.status === 'ingame' ? 'bg-blue-500/20 text-blue-700' :
                      'bg-gray-500/20 text-gray-700'
                    }`}>
                      {friend.status}
                    </span>
                    {friend.faction && <span className="ml-2 text-xs text-muted-foreground">({friend.faction})</span>}
                  </div>
                  <div className="space-x-2">
                    <Button variant="ghost" size="icon" title="Chat"><MessageSquare className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Manage Friend"><UserCog className="h-4 w-4" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No friends yet. Add some entities!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
