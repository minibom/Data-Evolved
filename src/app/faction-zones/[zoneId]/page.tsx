// src/app/faction-zones/[zoneId]/page.tsx
"use client";
// import ZoneDetailsUI from "@/components/ZoneDetailsUI"; // Future component

export default function ZoneDetailsPage({ params }: { params: { zoneId: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Zone Details - ID: {params.zoneId}</h1>
      {/* <ZoneDetailsUI zoneId={params.zoneId} /> */}
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Detailed info about the zone: controlling faction, available upgrades, buffs, core mission status.</p>
        <p className="text-sm mt-2">Placeholder for ZoneDetailsUI component.</p>
      </div>
    </div>
  );
}
