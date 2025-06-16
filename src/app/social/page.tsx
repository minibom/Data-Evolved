// src/app/social/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Rss } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SocialHubPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary">Social Hub</h1>
        <p className="text-lg text-muted-foreground">
          Connect with other Data Entities, manage your friends, and stay updated.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <Users className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="font-headline">Friends</CardTitle>
            <CardDescription>Manage your friend list and pending requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/social/friends">View Friends</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <MessageSquare className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="font-headline">Chat</CardTitle>
            <CardDescription>Communicate with friends and faction members.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild className="w-full" variant="secondary">
              <Link href="/social/chat">Open Chat</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <Rss className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="font-headline">Activity Feed</CardTitle>
            <CardDescription>Latest happenings in the Quantum Nexus.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                <p>Activity feed will be displayed here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
