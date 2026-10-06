import { Router } from 'express';
import { generateText, streamText, getAiStatus } from '../controllers/ai.controller';

const router = Router();

// 1. Status route
router.get('/status', getAiStatus);

// 2. Text generation route
router.post('/generate', generateText);
router.post('/text', generateText);

// 3. Streaming text route
router.post('/stream', streamText);

export default router;
