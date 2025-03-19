import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../../core/interfaces/logging/ILogger';

export const errorHandlerMiddleware = (
  logger: ILogger
) => (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Unhandled error', err);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
};