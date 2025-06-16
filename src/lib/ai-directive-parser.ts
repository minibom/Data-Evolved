// @/lib/ai-directive-parser.ts
import type { AIDirective, AICoreAIDirective } from '@packages/common-types/aiFaction';

interface ParsedAction {
  actionType: string; 
  targetId?: string; 
  parameters?: Record<string, any>; 
  originalDirectiveText: string;
}

export async function parseAIDirective(directive: AIDirective): Promise<ParsedAction[] | null> {
  console.log(`Parsing directive ID: ${directive.id} from ${directive.factionName}`);
  const directiveText = directive.rawOutput.directive.toLowerCase();
  const actions: ParsedAction[] = [];

  if (directiveText.includes("zone alpha") && directiveText.includes("stabilize data")) {
    actions.push({
      actionType: "MODIFY_ZONE_PARAMETER",
      targetId: "zone_alpha", 
      parameters: { stability: "+10", resource_rate_modifier: "0.05" },
      originalDirectiveText: directive.rawOutput.directive,
    });
  }

  if (directiveText.includes("inject rogue data packet") && directiveText.includes("global market")) {
    actions.push({
      actionType: "TRIGGER_EVENT",
      targetId: "global_market_glitch_event",
      parameters: { duration: "5_minutes", intensity: "medium" },
      originalDirectiveText: directive.rawOutput.directive,
    });
  }
  
  if (directive.factionName === 'AICore' && directiveText.includes("system-wide integrity check")) {
    actions.push({
        actionType: "START_WORLD_EVENT",
        targetId: "event_integrity_check_challenge",
        parameters: { duration: "24_hours", participationReward: "data_shards_small" },
        originalDirectiveText: directive.rawOutput.directive,
    });
  }

  if (actions.length > 0) {
    return actions;
  }

  console.warn(`Could not parse any specific actions from directive: "${directive.rawOutput.directive}"`);
  actions.push({
    actionType: "NARRATIVE_LOG",
    parameters: {
      faction: directive.factionName,
      message: `Directive issued: "${directive.rawOutput.directive}"`,
      impact_description: (directive as AICoreAIDirective).rawOutput.explanation || "Effect to be observed."
    },
    originalDirectiveText: directive.rawOutput.directive,
  });
  return actions;
}

export async function executeParsedActions(parsedActions: ParsedAction[]): Promise<void> {
  if (!parsedActions || parsedActions.length === 0) {
    console.log("No actions to execute.");
    return;
  }

  for (const action of parsedActions) {
    console.log(`Executing action: ${action.actionType}`, action);
    await new Promise(resolve => setTimeout(resolve, 100)); 
  }
  console.log("Finished executing parsed actions.");
}

export async function processAndExecuteDirective(directive: AIDirective): Promise<void> {
  if (directive.status !== 'active' && directive.status !== 'pending_review') { 
      console.log(`Directive ${directive.id} is not active or pending, skipping execution.`);
      return;
  }

  const parsedActions = await parseAIDirective(directive);
  if (parsedActions) {
    await executeParsedActions(parsedActions);
  } else {
    console.error(`Failed to parse directive ${directive.id}. No actions taken.`);
  }
}
