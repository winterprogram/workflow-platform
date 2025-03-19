import pino from 'pino';
import { ILogger } from '../../core/interfaces/logging/ILogger';

export class PinoLogger implements ILogger {
  private logger: pino.Logger;
  
  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty'
      }
    });
  }
  
  info(message: string, context?: any): void {
    this.logger.info(context, message);
  }
  
  error(message: string, error?: any): void {
    this.logger.error(error, message);
  }
  
  warn(message: string, context?: any): void {
    this.logger.warn(context, message);
  }
  
  debug(message: string, context?: any): void {
    this.logger.debug(context, message);
  }
}