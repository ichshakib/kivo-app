/**
 * Google Gemini AI constants and model configurations.
 */
export const GEMINI_MODELS = {
  FLASH: 'gemini-3.8-flash',
  FLASH_LITE: 'gemini-3.8-flash-lite',
  PRO: 'gemini-2.5-pro',
  LEGACY_FLASH: 'gemini-2.5-flash',
} as const;

export const DEFAULT_GEMINI_MODEL = GEMINI_MODELS.FLASH;

export const SUPPORTED_GEMINI_MODELS: string[] = Object.values(GEMINI_MODELS);

export type GeminiModel = (typeof GEMINI_MODELS)[keyof typeof GEMINI_MODELS];

export const THINKING_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type ThinkingLevel = (typeof THINKING_LEVELS)[keyof typeof THINKING_LEVELS];
