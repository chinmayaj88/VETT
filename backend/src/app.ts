import express, { Express } from 'express';
import cors from 'cors';
import { createTaskRoutes } from './presentation/routes/taskRoutes';
import { createVoiceRoutes } from './presentation/routes/voiceRoutes';
import { errorHandler } from './presentation/middleware/errorHandler';
import { getTaskController, getVoiceController } from './infrastructure/container/Container';

export function createApp(): Express {
  const app = express();

  // CORS configuration
  app.use(cors());
  
  // Body parsing with size limit
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API routes
  app.use('/api/tasks', createTaskRoutes(getTaskController()));
  app.use('/api/voice', createVoiceRoutes(getVoiceController()));

  // Health check endpoint
  app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

