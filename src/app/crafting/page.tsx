// src/app/crafting/page.tsx
"use client";
// import CraftingUI from "@/components/CraftingUI"; // Future component

export default function CraftingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Crafting & Synthesis</h1>
      {/* <CraftingUI /> */}
      <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Crafting recipes, material requirements, and crafting interface.</p>
        <p className="text-sm mt-2">Placeholder for CraftingUI component.</p>
      </div>
    </div>
  );
}
