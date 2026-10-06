export interface GenerateTextOptions {
  prompt: string;
  model?: string;
  systemInstruction?: string;
  thinkingLevel?: 'low' | 'medium' | 'high';
  temperature?: number;
  maxOutputTokens?: number;
  previousInteractionId?: string;
}

export interface GenerateTextResult {
  text: string;
  interactionId?: string;
  model: string;
  thinkingLevel?: string;
}
