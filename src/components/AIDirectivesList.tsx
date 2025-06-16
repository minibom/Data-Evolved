// @/components/AIDirectivesList.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import type { AIDirective, AIFactionName } from '@packages/common-types/aiFaction';
import AIDirectiveCard from './AIDirectiveCard';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCw, ServerCrash, BrainCircuit, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'; // For Skeleton

export default function AIDirectivesList() {
  const [directives, setDirectives] = useState<AIDirective[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<AIFactionName | null>(null);
  const { toast } = useToast();

  const fetchDirectives = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/ai-directives');
      if (!response.ok) {
        throw new Error(`Failed to fetch directives: ${response.statusText}`);
      }
      const data = await response.json();
      setDirectives(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Error", description: `Could not fetch directives: ${err.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDirectives();
  }, [fetchDirectives]);

  const handleGenerateDirective = async (factionName: AIFactionName) => {
    setIsGenerating(factionName);
    try {
      const response = await fetch('/api/ai-orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factionName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to generate directive for ${factionName}`);
      }
      // const newDirective = await response.json(); // No longer directly adding, refetch handles it
      await fetchDirectives(); 
      toast({ title: "Success", description: `${factionName} directive generated and is pending review.` });
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Error", description: `Could not generate directive: ${err.message}`, variant: "destructive" });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: AIDirective['status']) => {
    try {
      const response = await fetch('/api/admin/ai-directives', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update directive status');
      }
      await fetchDirectives(); 
      toast({ title: "Status Updated", description: `Directive ${id} status set to ${status}.` });
    } catch (err: any) {
      toast({ title: "Error", description: `Failed to update status: ${err.message}`, variant: "destructive" });
    }
  };

  if (error) {
    return (
      <div className="text-center py-10 text-destructive flex flex-col items-center">
        <ServerCrash className="w-16 h-16 mb-4" />
        <p className="text-xl font-semibold">Error loading AI directives.</p>
        <p className="text-sm mb-4">{error}</p>
        <Button onClick={fetchDirectives} variant="outline">
          <RotateCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }
  
  const filterDirectives = (status: AIDirective['status'] | 'all') => {
    if (status === 'all') return directives;
    return directives.filter(d => d.status === status);
  }

  const Skeleton = ({ className }: {className?: string}) => <div className={`bg-muted animate-pulse rounded ${className}`} />;

  const renderDirectiveList = (filteredDirectives: AIDirective[]) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <Card key={i} className="shadow-md">
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter><Skeleton className="h-8 w-1/4" /></CardFooter>
            </Card>
          ))}
        </div>
      );
    }
    if (filteredDirectives.length === 0) {
      return <p className="text-center py-10 text-muted-foreground">No directives found for this status.</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDirectives.map((directive) => (
          <AIDirectiveCard key={directive.id} directive={directive} onUpdateStatus={handleUpdateStatus} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-3xl font-bold font-headline">AI Directives Monitor</h2>
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={() => handleGenerateDirective('AICore')} 
            disabled={isGenerating === 'AICore' || isLoading}
            variant="outline"
            className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400/20"
          >
            {isGenerating === 'AICore' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
            Generate AI Core Directive
          </Button>
          <Button 
            onClick={() => handleGenerateDirective('Anonymous')} 
            disabled={isGenerating === 'Anonymous' || isLoading}
            variant="outline"
            className="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-400/20"
          >
            {isGenerating === 'Anonymous' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            Generate Anonymous Directive
          </Button>
          <Button onClick={fetchDirectives} disabled={isLoading} variant="secondary">
            <RotateCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh List
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending_review">Pending Review</TabsTrigger>
          <TabsTrigger value="overridden">Overridden</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {renderDirectiveList(filterDirectives('active'))}
        </TabsContent>
        <TabsContent value="pending_review">
          {renderDirectiveList(filterDirectives('pending_review'))}
        </TabsContent>
        <TabsContent value="overridden">
          {renderDirectiveList(filterDirectives('overridden'))}
        </TabsContent>
        <TabsContent value="archived">
          {renderDirectiveList(filterDirectives('archived'))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
