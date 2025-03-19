import { Router } from 'express';
import { MetricsService } from '../../observability/metrics';

export const createMetricsRouter = (metricsService: MetricsService): Router => {
  const router = Router();
  
  router.get('/', async (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(await metricsService.getMetrics());
  });
  
  return router;
};