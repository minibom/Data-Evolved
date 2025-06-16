// src/components/SkillTree.tsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranchPlus, Zap, ShieldCheck, Brain } from "lucide-react"; // Example icons

interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number; // e.g., skill points or data shards
  icon?: React.ElementType;
  dependencies?: string[]; // IDs of skills required before this one
  tier: number;
}

interface SkillTreeProps {
  playerId: string;
  // initialUnlockedSkills: string[];
  // availableSkillPoints: number;
}

// Mock skill data
const allSkills: Skill[] = [
  { id: "s1", name: "GHZ Boost I", description: "+5% GHZ.", cost: 1, tier: 1, icon: Zap },
  { id: "s2", name: "Firewall Protocol I", description: "+5% Firewall.", cost: 1, tier: 1, icon: ShieldCheck },
  { id: "s3", name: "Memory Partition I", description: "+5% Memory.", cost: 1, tier: 1, icon: Brain },
  { id: "s4", name: "GHZ Boost II", description: "+10% GHZ.", cost: 2, tier: 2, icon: Zap, dependencies: ["s1"] },
  { id: "s5", name: "Data Spike", description: "Unlock a targeted data attack skill.", cost: 3, tier: 2, dependencies: ["s1"] },
];

export default function SkillTree({ playerId }: SkillTreeProps) {
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>(["s1"]); // Mock: "s1" initially unlocked
  const [skillPoints, setSkillPoints] = useState(3); // Mock points

  // Fetch player's skill tree data in useEffect

  const canUnlock = (skill: Skill): boolean => {
    if (unlockedSkills.includes(skill.id)) return false; // Already unlocked
    if (skillPoints < skill.cost) return false; // Not enough points
    if (skill.dependencies) {
      return skill.dependencies.every(depId => unlockedSkills.includes(depId));
    }
    return true;
  };

  const handleUnlockSkill = (skillId: string) => {
    const skill = allSkills.find(s => s.id === skillId);
    if (skill && canUnlock(skill)) {
      setUnlockedSkills(prev => [...prev, skillId]);
      setSkillPoints(prev => prev - skill.cost);
      // TODO: API call to save unlocked skill
      console.log(`Player ${playerId} unlocked skill: ${skill.name}`);
    }
  };

  const tiers = Array.from(new Set(allSkills.map(s => s.tier))).sort((a,b) => a - b);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <GitBranchPlus className="h-6 w-6 text-primary" />
          Skill Matrix
        </CardTitle>
        <CardDescription>Available Skill Points: <span className="font-bold text-primary">{skillPoints}</span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {tiers.map(tier => (
          <div key={tier}>
            <h3 className="text-lg font-semibold mb-2 text-accent">Tier {tier}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSkills.filter(s => s.tier === tier).map(skill => {
                const isUnlocked = unlockedSkills.includes(skill.id);
                const Icon = skill.icon;
                return (
                  <Card key={skill.id} className={`p-4 ${isUnlocked ? 'bg-primary/10 border-primary' : 'bg-muted/50'}`}>
                    <div className="flex items-center mb-2">
                      {Icon && <Icon className={`h-5 w-5 mr-2 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />}
                      <h4 className={`font-semibold ${isUnlocked ? 'text-primary' : ''}`}>{skill.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 h-10 overflow-y-auto">{skill.description}</p>
                    <p className="text-xs mb-2">Cost: {skill.cost} SP</p>
                    {skill.dependencies && <p className="text-xs text-muted-foreground">Req: {skill.dependencies.join(', ')}</p>}
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => handleUnlockSkill(skill.id)}
                      disabled={isUnlocked || !canUnlock(skill)}
                    >
                      {isUnlocked ? "Unlocked" : "Unlock"}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
