"use client";
import { ShieldHalf, Zap } from "lucide-react";
// import { useAuth } from "@/context/AuthContext"; // To get player's faction

export default function PlayerFactionPage() {
  // const { currentUser } = useAuth(); // Placeholder
  // const playerFaction = currentUser?.faction || "Undecided"; // Example
  const playerFaction = "AICore"; // Mock data

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        {playerFaction === "AICore" ? (
          <ShieldHalf className="h-10 w-10 text-primary mr-3" />
        ) : playerFaction === "Hacker" ? (
          <Zap className="h-10 w-10 text-purple-500 mr-3" />
        ) : null}
        <h1 className="text-3xl font-bold font-headline">Faction Details: {playerFaction}</h1>
      </div>
      <div className="p-6 bg-card border rounded-lg shadow space-y-4">
        <p className="text-muted-foreground">
          Detailed information about your faction, its current goals, active buffs, and available resources will be displayed here.
        </p>
        {playerFaction === "AICore" && (
          <div>
            <h2 className="text-xl font-semibold font-headline">AI Core Directives</h2>
            <p className="text-sm">Current Buff: +10% Firewall in Nexus-controlled Zones.</p>
            <p className="text-sm">Current Goal: Secure Zone Gamma.</p>
          </div>
        )}
        {playerFaction === "Hacker" && (
          <div>
            <h2 className="text-xl font-semibold font-headline">Shadow Decoders Operations</h2>
            <p className="text-sm">Current Buff: +5% GHZ when attacking AI Core entities.</p>
            <p className="text-sm">Current Goal: Disrupt data flow in Zone Beta.</p>
          </div>
        )}
        {playerFaction === "Undecided" && (
           <p className="text-lg">You have not yet chosen a faction. Reach 10 GHZ to make your choice!</p>
        )}
      </div>
    </div>
  );
}
