// @/components/AIDirectiveCard.tsx
import type { AIDirective, AICoreAIDirective, AnonymousAIDirective } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Zap, AlertTriangle, CheckCircle, Archive } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AIDirectiveCardProps {
  directive: AIDirective;
  onUpdateStatus: (id: string, status: AIDirective['status']) => void;
}

export default function AIDirectiveCard({ directive, onUpdateStatus }: AIDirectiveCardProps) {
  const FactionIcon = directive.factionName === 'AICore' ? Bot : Zap;
  const factionColor = directive.factionName === 'AICore' ? 'text-blue-500' : 'text-purple-500'; // Using direct colors as theme accent might be too strong for icons.
  
  const statusConfig = {
    active: { icon: CheckCircle, color: 'bg-green-500', label: 'Active' },
    overridden: { icon: AlertTriangle, color: 'bg-yellow-500', label: 'Overridden' },
    pending_review: { icon: AlertTriangle, color: 'bg-orange-500', label: 'Pending Review' },
    archived: { icon: Archive, color: 'bg-gray-500', label: 'Archived' },
  };
  
  const currentStatus = statusConfig[directive.status] || statusConfig.archived;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FactionIcon className={`h-6 w-6 ${factionColor}`} />
              <CardTitle className="font-headline text-xl">{directive.factionName} Directive</CardTitle>
            </div>
            <CardDescription>ID: {directive.id}</CardDescription>
          </div>
          <Badge variant={directive.status === 'active' ? 'default' : 'secondary'} className={`${currentStatus.color} text-white`}>
            <currentStatus.icon className="h-3 w-3 mr-1" />
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm mb-2 font-medium">Directive:</p>
        <blockquote className="border-l-4 border-primary pl-4 py-2 bg-muted/50 rounded-r-md">
          <p className="italic text-foreground">"{directive.rawOutput.directive}"</p>
        </blockquote>
        {(directive as AICoreAIDirective).explanation && (
          <>
            <p className="text-sm mt-3 mb-1 font-medium">Explanation:</p>
            <p className="text-xs text-muted-foreground">{(directive as AICoreAIDirective).explanation}</p>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t">
        <span>{formatDistanceToNow(new Date(directive.timestamp), { addSuffix: true })}</span>
        <div className="space-x-2">
          {directive.status === 'pending_review' && (
            <Button size="xs" variant="outline" onClick={() => onUpdateStatus(directive.id, 'active')}>Approve</Button>
          )}
          {directive.status === 'active' && (
            <Button size="xs" variant="outline" onClick={() => onUpdateStatus(directive.id, 'overridden')}>Override</Button>
          )}
           {(directive.status === 'active' || directive.status === 'overridden' || directive.status === 'pending_review') && (
            <Button size="xs" variant="ghost" onClick={() => onUpdateStatus(directive.id, 'archived')}>Archive</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
