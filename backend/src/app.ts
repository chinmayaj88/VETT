import express, { Express } from 'express';
import cors from 'cors';
import { createTaskRoutes } from './presentation/routes/taskRoutes';
import { createVoiceRoutes } from './presentation/routes/voiceRoutes';
import { errorHandler } from './presentation/middleware/errorHandler';
import { getTaskController, getVoiceController } from './infrastructure/container/Container';

export function createApp(): Express {
  const app = express();

  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) {
        return callback(null, true);
      }
      
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000', 
        'http://localhost:8080', 
      ];
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  app.use(cors(corsOptions));
  
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use('/api/tasks', createTaskRoutes(getTaskController()));
  app.use('/api/voice', createVoiceRoutes(getVoiceController()));

  app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  app.use(errorHandler);

  return app;
}

