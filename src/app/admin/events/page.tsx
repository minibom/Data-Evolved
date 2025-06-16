// src/app/admin/events/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <CalendarClock className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Game Event Management</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active & Upcoming Events</CardTitle>
          <CardDescription>Monitor, create, and manage in-game events.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Event list, creation tools, and scheduling options will be displayed here.</p>
          {/* Placeholder for event management UI */}
        </CardContent>
      </Card>
    </div>
  );
}
