"use client";

export default function PlayerBasePage({ params }: { params: { playerId: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Player Base Management - ID: {params.playerId}</h1>
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Player base/housing management UI will be here.</p>
        <p className="text-sm mt-2">Features like upgrading structures, resource management, etc.</p>
      </div>
    </div>
  );
}
