import { Router } from 'express';
import healthRouter from './health.route';
import authRouter from './auth.routes';
import aiRouter from './ai.routes';
import storageRouter from './storage.routes';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

router.get('/', (_req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        name: 'Kivo API',
        version: '1.0.0',
        status: 'online',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/api/health',
          aiStatus: '/api/ai/status',
          aiGenerate: '/api/ai/generate',
          aiStream: '/api/ai/stream',
          storageStatus: '/api/storage/status',
          storagePresignedUrl: '/api/storage/presigned-url',
          storageUploadUrl: '/api/storage/upload-url',
          googleLogin: '/api/auth/google',
          authStatus: '/api/auth/status',
          me: '/api/auth/me',
        },
      },
      'Welcome to Kivo API'
    )
  );
});

// Mount modular sub-routes
router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/ai', aiRouter);
router.use('/storage', storageRouter);

export default router;
export { router };
