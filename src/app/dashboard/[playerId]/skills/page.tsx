"use client";

// import SkillTree from "@/components/SkillTree"; // Assuming this component will be built

export default function PlayerSkillsPage({ params }: { params: { playerId: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Skill Tree - Player: {params.playerId}</h1>
      {/* <SkillTree playerId={params.playerId} /> */}
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Player skill tree and upgrade interface will be here.</p>
        <p className="text-sm mt-2">Placeholder for SkillTree component.</p>
      </div>
    </div>
  );
}
