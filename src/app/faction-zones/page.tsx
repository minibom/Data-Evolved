// src/app/faction-zones/page.tsx
"use client";
// import ZoneMapOverview from "@/components/ZoneMapOverview"; // Future component

export default function FactionZonesOverviewPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Faction Zone Control</h1>
      {/* <ZoneMapOverview /> */}
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Overview map of all zones, faction control status, active conflicts.</p>
        <p className="text-sm mt-2">Placeholder for ZoneMapOverview component.</p>
      </div>
    </div>
  );
}
