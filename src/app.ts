import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { AggregationController } from './adapters/controllers/AggregationController';
import { EventController } from './adapters/controllers/EventController';
import { ILogger } from './core/interfaces/logging/ILogger';
import { createAggregationRouter } from './framework/express/routes/aggregationRoutes';
import { createEventRouter } from './framework/express/routes/eventRoutes';
import { createMetricsRouter } from './framework/express/routes/metricsRoutes';
import { MetricsService } from './framework/observability/metrics';
import { errorHandlerMiddleware } from './framework/middlewares/error';


export const createApp = (
  logger: ILogger,
  eventController: EventController,
  aggregationController: AggregationController,
  metricsService: MetricsService
): Application => {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(pinoHttp({ logger: logger as any }));
  
  // Routes
  app.use('/api/events', createEventRouter(eventController));
  app.use('/api/aggregations', createAggregationRouter(aggregationController));
  app.use('/metrics', createMetricsRouter(metricsService));
  
  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Error handler
  app.use(errorHandlerMiddleware(logger));
  
  return app;
};