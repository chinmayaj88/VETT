import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message === 'Task not found') {
    return res.status(404).json({ error: err.message });
  }

  if (err.message.includes('required') || err.message.includes('cannot be empty')) {
    return res.status(400).json({ error: err.message });
  }

  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    console.error('Error:', err);
  }

  res.status(500).json({
    error: 'Internal server error',
    ...(isDevelopment && { message: err.message }),
  });
};
