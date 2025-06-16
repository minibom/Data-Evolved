"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, BarChart2, GitBranch, Briefcase, BookOpen } from "lucide-react";
import Link from "next/link";
// import { useAuth } from "@/context/AuthContext"; // Assuming useAuth provides currentUser

export default function DashboardPage() {
  // const { currentUser } = useAuth(); // Placeholder for getting current user
  const playerId = "mock-player-id"; // Replace with actual player ID from auth

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary">Player Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Welcome, Data Entity! Manage your profile, inventory, and progress.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <User className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="font-headline">Profile</CardTitle>
            <CardDescription>View and manage your entity details.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for profile info */}
            <p className="text-sm text-muted-foreground">Player ID: {playerId}</p>
            <p className="text-sm text-muted-foreground">GHZ: 15 (Example)</p>
             <Link href={`/dashboard/${playerId}/base`}>
                <Button variant="link" className="p-0 h-auto mt-2">Manage Base</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <Briefcase className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="font-headline">Inventory</CardTitle>
            <CardDescription>Access your collected Data Scraps and items.</CardDescription>
          </CardHeader>
          <CardContent>
             <Link href={`/dashboard/${playerId}/inventory`}>
                <Button variant="secondary" className="w-full">Open Inventory</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <BookOpen className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="font-headline">Quests</CardTitle>
            <CardDescription>Track your active and completed objectives.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/dashboard/${playerId}/quests`}>
                <Button variant="secondary" className="w-full">View Quest Log</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <Shield className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="font-headline">Faction</CardTitle>
            <CardDescription>Details about your current faction alignment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/faction">
                <Button variant="secondary" className="w-full">Faction Details</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <BarChart2 className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="font-headline">Stats</CardTitle>
            <CardDescription>Review your combat and entity statistics.</CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/dashboard/stats">
                <Button variant="secondary" className="w-full">View Stats</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <GitBranch className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="font-headline">Skills</CardTitle>
            <CardDescription>Upgrade and manage your entity's abilities.</CardDescription>
          </CardHeader>
          <CardContent>
             <Link href={`/dashboard/${playerId}/skills`}>
                <Button variant="secondary" className="w-full">Open Skill Tree</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
