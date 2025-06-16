"use client";

// import QuestLog from "@/components/QuestLog"; // Assuming this component will be built

export default function PlayerQuestsPage({ params }: { params: { playerId: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Quest Log - Player: {params.playerId}</h1>
      {/* <QuestLog playerId={params.playerId} /> */}
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Active and completed quests will be listed here.</p>
        <p className="text-sm mt-2">Placeholder for QuestLog component.</p>
      </div>
    </div>
  );
}
