// packages/common-types/aiConfig.ts
import {z} from 'genkit';

// This type defines the structure for dynamic AI configuration parameters
// that admins can adjust.

export const AIParameterSchema = z.object({
  key: z.string().describe("The unique identifier for the AI parameter."),
  value: z.union([z.string(), z.number(), z.boolean()]).describe("The value of the parameter."),
  description: z.string().describe("A brief explanation of what this parameter controls."),
  category: z.enum(["AICore", "Anonymous", "WorldEvents", "NPCBehavior", "Economy"])
    .describe("The category this parameter falls under for organization."),
  min: z.number().optional().describe("Minimum allowed value (for numerical parameters)."),
  max: z.number().optional().describe("Maximum allowed value (for numerical parameters)."),
  step: z.number().optional().describe("Step increment (for numerical parameters)."),
  options: z.array(z.string()).optional().describe("Predefined options (for string parameters acting as enums)."),
});
export type AIParameter = z.infer<typeof AIParameterSchema>;


export const AIFactionGoalSchema = z.object({
  goalId: z.string().describe("Unique ID for the goal."),
  description: z.string().describe("Description of the AI faction's goal."),
  priority: z.number().min(0).max(1).describe("Priority of this goal (0-1)."),
  targetType: z.enum(["zone_control", "resource_disruption", "player_engagement", "narrative_progression"])
    .optional().describe("Type of target this goal relates to."),
  targetValue: z.string().optional().describe("Specific target, e.g., zone ID, resource type."),
  isActive: z.boolean().default(true),
});
export type AIFactionGoal = z.infer<typeof AIFactionGoalSchema>;


export const DynamicAIConfigSchema = z.object({
  parameters: z.array(AIParameterSchema).describe("List of adjustable AI parameters."),
  aiCoreGoals: z.array(AIFactionGoalSchema).describe("Current strategic goals for AI Core."),
  anonymousGoals: z.array(AIFactionGoalSchema).describe("Current strategic goals for Anonymous."),
  lastUpdated: z.string().datetime().describe("ISO timestamp of the last update."),
  updatedBy: z.string().optional().describe("Identifier of the admin who last updated the config."),
});
export type DynamicAIConfig = z.infer<typeof DynamicAIConfigSchema>;


// Default values or example structure
export const defaultAICoreParameters: AIParameter[] = [
  { key: "aiCore.stabilityFocus", value: 0.7, description: "AI Core's focus on maintaining game stability (0-1).", category: "AICore", min: 0, max: 1, step: 0.05 },
  { key: "aiCore.eventResponseDelay", value: 60, description: "Delay in seconds for AI Core to respond to major player actions.", category: "AICore", min: 10, max: 300, step: 10 },
];

export const defaultAnonymousParameters: AIParameter[] = [
   { key: "anonymous.disruptionChance", value: 0.25, description: "Chance for Anonymous to attempt a disruptive action per cycle (0-1).", category: "Anonymous", min: 0, max: 1, step: 0.01 },
   { key: "anonymous.maxTargetedPlayers", value: 3, description: "Maximum players Anonymous might target with a specific minor disruptive event.", category: "Anonymous", min: 1, max: 10, step: 1 },
];

console.log("Common AI Config types (packages/common-types/aiConfig.ts) loaded.");
