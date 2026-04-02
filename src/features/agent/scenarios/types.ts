export type MessageType = 'user' | 'assistant' | 'tool_call';
export type ToolStatus = 'running' | 'completed';
export type ToolCategory = 'site_db' | 'weather_api' | 'doc_gen' | 'knowledge';

export interface FileAttachment {
  name: string;
  size: string;
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content?: string;
  toolName?: string;
  toolCategory?: ToolCategory;
  toolStatus?: ToolStatus;
  toolResult?: string;
  artifact?: ArtifactData;
  attachment?: FileAttachment;
}

export interface ArtifactData {
  title: string;
  type: 'document' | 'chart' | 'estimate' | 'knowledge';
  content: string;
}

export interface ScenarioStep {
  type: MessageType;
  delay: number;
  content?: string;
  toolName?: string;
  toolResult?: string;
  artifact?: ArtifactData;
}

export type ScenarioIconId = 'description' | 'psychology' | 'calendar_month' | 'payments';

export interface ScenarioDefinition {
  id: string;
  label: string;
  iconId: ScenarioIconId;
  trigger: string;
  keywords: string[];
  steps: ScenarioStep[];
  attachment?: FileAttachment;
}

const categoryMap: Record<string, ToolCategory> = {
  site_: 'site_db',
  weather_: 'weather_api',
  doc_: 'doc_gen',
  knowledge_: 'knowledge',
};

export function getToolCategory(toolName: string): ToolCategory {
  for (const [prefix, category] of Object.entries(categoryMap)) {
    if (toolName.startsWith(prefix)) return category;
  }
  return 'site_db';
}
