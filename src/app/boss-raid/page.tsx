// src/app/boss-raid/page.tsx
"use client";
// import BossRaidUI from "@/components/BossRaidUI"; // Future component

export default function BossRaidPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">World Boss Raids</h1>
      {/* <BossRaidUI /> */}
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Information about current world boss, participants, and join raid options.</p>
        <p className="text-sm mt-2">Placeholder for BossRaidUI component.</p>
      </div>
    </div>
  );
}
