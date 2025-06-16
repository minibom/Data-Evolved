// @/app/admin/ai-settings/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Settings, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { DynamicAIConfig, AIParameter, AIFactionGoal } from '@packages/common-types/aiConfig'; // Ensure this path is correct
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const initialConfig: DynamicAIConfig = {
  parameters: [],
  aiCoreGoals: [],
  anonymousGoals: [],
  lastUpdated: new Date().toISOString(),
};


export default function AISettingsPage() {
  const [config, setConfig] = useState<DynamicAIConfig>(initialConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/ai-config');
      if (!response.ok) throw new Error('Failed to fetch AI configuration.');
      const data = await response.json();
      setConfig(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Error Fetching Config", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleParameterChange = (key: string, value: string | number | boolean) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      parameters: prevConfig.parameters.map(p => p.key === key ? { ...p, value } : p),
    }));
  };
  
  const handleGoalChange = (faction: 'AICore' | 'Anonymous', goalId: string, field: keyof AIFactionGoal, value: any) => {
    const goalsKey = faction === 'AICore' ? 'aiCoreGoals' : 'anonymousGoals';
    setConfig(prevConfig => ({
      ...prevConfig,
      [goalsKey]: prevConfig[goalsKey].map(g =>
        g.goalId === goalId ? { ...g, [field]: value } : g
      ),
    }));
  };


  const handleSaveConfig = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || 'Failed to save AI configuration.');
      }
      const savedConfig = await response.json();
      setConfig(savedConfig.config); // Update with server response, e.g., new lastUpdated
      toast({ title: "Success", description: "AI configuration saved successfully." });
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Error Saving Config", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading AI Settings...</span></div>;
  }

  if (error && !config.parameters.length) { // Show critical error if config is essential and fails to load
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive"><AlertTriangle className="mr-2" /> Error Loading Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={fetchConfig} variant="outline" className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }
  
  const renderParameterInput = (param: AIParameter) => {
    const commonProps = {
      id: param.key,
      value: param.value as any,
      onValueChange: (val: any) => handleParameterChange(param.key, val),
      disabled: isSaving,
    };

    if (typeof param.value === 'boolean') {
      return <Switch checked={param.value} onCheckedChange={(checked) => handleParameterChange(param.key, checked)} disabled={isSaving} />;
    } else if (typeof param.value === 'number') {
      return (
        <div className="flex items-center gap-2">
          <Slider
            defaultValue={[param.value]}
            onValueChange={(newVal) => handleParameterChange(param.key, newVal[0])}
            min={param.min ?? 0}
            max={param.max ?? 1}
            step={param.step ?? 0.01}
            className="w-[calc(100%-4rem)]"
            disabled={isSaving}
          />
          <Input type="number" {...commonProps} value={String(param.value)} onChange={(e) => handleParameterChange(param.key, parseFloat(e.target.value))} className="w-20 text-sm h-8" />
        </div>
      );
    } else if (param.options && param.options.length > 0) {
       return (
         <Select value={String(param.value)} onValueChange={(val) => handleParameterChange(param.key, val)} disabled={isSaving}>
           <SelectTrigger className="h-9 text-sm">
             <SelectValue placeholder="Select an option" />
           </SelectTrigger>
           <SelectContent>
             {param.options.map(opt => <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>)}
           </SelectContent>
         </Select>
       );
    }
    return <Input type="text" {...commonProps} onChange={(e) => handleParameterChange(param.key, e.target.value)} className="h-9 text-sm"/>;
  };
  
  const renderGoalInputs = (goal: AIFactionGoal, faction: 'AICore' | 'Anonymous') => (
    <div key={goal.goalId} className="p-3 border rounded-md space-y-3 bg-muted/20">
        <h4 className="font-medium text-sm text-primary">{goal.goalId}</h4>
        <div>
            <Label htmlFor={`${faction}-${goal.goalId}-desc`} className="text-xs">Description</Label>
            <Input id={`${faction}-${goal.goalId}-desc`} value={goal.description} onChange={(e) => handleGoalChange(faction, goal.goalId, 'description', e.target.value)} className="h-8 text-xs" />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div>
                <Label htmlFor={`${faction}-${goal.goalId}-priority`} className="text-xs">Priority (0-1)</Label>
                <Input id={`${faction}-${goal.goalId}-priority`} type="number" step="0.1" min="0" max="1" value={goal.priority} onChange={(e) => handleGoalChange(faction, goal.goalId, 'priority', parseFloat(e.target.value))}  className="h-8 text-xs" />
            </div>
             <div>
                <Label htmlFor={`${faction}-${goal.goalId}-isActive`} className="text-xs block mb-1">Active</Label>
                <Switch id={`${faction}-${goal.goalId}-isActive`} checked={goal.isActive} onCheckedChange={(val) => handleGoalChange(faction, goal.goalId, 'isActive', val)} />
            </div>
        </div>
         {goal.targetType && (
            <div className="grid grid-cols-2 gap-3">
                 <div>
                    <Label htmlFor={`${faction}-${goal.goalId}-targetType`} className="text-xs">Target Type</Label>
                    <Input id={`${faction}-${goal.goalId}-targetType`} value={goal.targetType} readOnly className="h-8 text-xs bg-muted" />
                </div>
                <div>
                    <Label htmlFor={`${faction}-${goal.goalId}-targetValue`} className="text-xs">Target Value</Label>
                    <Input id={`${faction}-${goal.goalId}-targetValue`} value={goal.targetValue || ''} onChange={(e) => handleGoalChange(faction, goal.goalId, 'targetValue', e.target.value)}  className="h-8 text-xs" />
                </div>
            </div>
         )}
    </div>
  );


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Dynamic AI Configuration</h1>
        </div>
        <Button onClick={handleSaveConfig} disabled={isSaving || isLoading}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Configuration
        </Button>
      </div>
      
      {error && <p className="text-destructive text-sm"><AlertTriangle className="inline h-4 w-4 mr-1" />{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Global AI Parameters</CardTitle>
          <CardDescription>Adjust high-level parameters that influence general AI behavior across the game.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.parameters.length > 0 ? config.parameters.map(param => (
            <div key={param.key} className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 items-center">
              <Label htmlFor={param.key} className="md:col-span-1">
                {param.key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
                <span className="block text-xs text-muted-foreground font-normal">{param.description} ({param.category})</span>
              </Label>
              <div className="md:col-span-2">
                {renderParameterInput(param)}
              </div>
            </div>
          )) : <p className="text-muted-foreground text-sm">No parameters loaded or defined.</p>}
        </CardContent>
      </Card>
      
      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="ai-core-goals" className="border rounded-lg bg-card overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-xl">AI Core Strategic Goals</CardTitle>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0 space-y-3">
                {config.aiCoreGoals.length > 0 ? config.aiCoreGoals.map(goal => renderGoalInputs(goal, 'AICore')) : <p className="text-muted-foreground text-sm">No AI Core goals defined.</p>}
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="anonymous-goals" className="border rounded-lg bg-card overflow-hidden">
             <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-xl">Anonymous Faction Goals</CardTitle>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0 space-y-3">
                 {config.anonymousGoals.length > 0 ? config.anonymousGoals.map(goal => renderGoalInputs(goal, 'Anonymous')) : <p className="text-muted-foreground text-sm">No Anonymous goals defined.</p>}
            </AccordionContent>
        </AccordionItem>
      </Accordion>

      <CardFooter className="mt-6 text-xs text-muted-foreground">
        Last updated: {new Date(config.lastUpdated).toLocaleString()} {config.updatedBy && `by ${config.updatedBy}`}
        <div className="flex items-center gap-1 mt-2">
            <Info size={14} />
            <span>Changes to these settings may take a few moments to propagate through the Quantum Nexus.</span>
        </div>
      </CardFooter>
    </div>
  );
}
