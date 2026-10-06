import { Request, Response } from 'express';
import {
  generateText as generateTextService,
  streamText as streamTextService,
} from '../services/ai';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { ENV } from '../config/env';
import { DEFAULT_GEMINI_MODEL, SUPPORTED_GEMINI_MODELS } from '../constants/ai.constants';

/**
 * Controller for generating text using Gemini AI models.
 */
export const generateText = asyncHandler(async (req: Request, res: Response) => {
  const {
    prompt,
    model = DEFAULT_GEMINI_MODEL,
    systemInstruction,
    thinkingLevel,
    temperature,
    maxOutputTokens,
    previousInteractionId,
  } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    throw new ApiError(400, 'Field "prompt" is required and must be a string.');
  }

  const result = await generateTextService({
    prompt,
    model,
    systemInstruction,
    thinkingLevel,
    temperature,
    maxOutputTokens,
    previousInteractionId,
  });

  return res.status(200).json(new ApiResponse(200, result, 'Text generated successfully'));
});

/**
 * Controller for streaming text response using Gemini AI models.
 */
export const streamText = asyncHandler(async (req: Request, res: Response) => {
  const {
    prompt,
    model = DEFAULT_GEMINI_MODEL,
    systemInstruction,
    thinkingLevel,
    temperature,
    maxOutputTokens,
    previousInteractionId,
  } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    throw new ApiError(400, 'Field "prompt" is required and must be a string.');
  }

  const stream = await streamTextService({
    prompt,
    model,
    systemInstruction,
    thinkingLevel,
    temperature,
    maxOutputTokens,
    previousInteractionId,
  });

  // Setup SSE stream headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    for await (const chunk of stream as any) {
      let textChunk = '';
      if (chunk.event_type === 'step.delta' && chunk.delta?.type === 'text') {
        textChunk = chunk.delta.text || '';
      } else if (chunk.text) {
        textChunk = typeof chunk.text === 'function' ? chunk.text() : chunk.text;
      }

      if (textChunk) {
        res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
      }
    }
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message || 'Stream failed' })}\n\n`);
    res.end();
  }
});

/**
 * Controller to get current AI configuration status.
 */
export const getAiStatus = asyncHandler(async (_req: Request, res: Response) => {
  const isConfigured = Boolean(ENV.GEMINI.API_KEY);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        configured: isConfigured,
        defaultModel: DEFAULT_GEMINI_MODEL,
        supportedModels: SUPPORTED_GEMINI_MODELS,
      },
      'AI status retrieved successfully'
    )
  );
});
