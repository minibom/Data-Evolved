"use client";

import PlayerStatsDisplay from "@/components/PlayerStatsDisplay";
// import { useAuth } from "@/context/AuthContext"; // To get player's stats

export default function PlayerStatsOverviewPage() {
  // const { currentUser } = useAuth(); // Placeholder
  // const stats = currentUser?.stats || { power: 100, memory: 100, firewall: 50, ghz: 10 }; // Mock
  const mockStats = { power: 120, memory: 150, firewall: 70, ghz: 12 };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Entity Combat Statistics</h1>
      <PlayerStatsDisplay stats={mockStats} />
      <div className="mt-6 p-6 bg-card border rounded-lg shadow">
        <h2 className="text-xl font-semibold font-headline">Additional Stats</h2>
        <ul className="list-disc list-inside text-muted-foreground mt-2">
          <li>Reputation with AI Core: Neutral</li>
          <li>Reputation with Hackers: Slightly Friendly</li>
          <li>Zones Controlled: 0</li>
          <li>Data Scraps collected: 1050</li>
        </ul>
      </div>
    </div>
  );
}
