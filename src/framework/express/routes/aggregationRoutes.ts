import { Router } from 'express';
import { AggregationController } from '../../../adapters/controllers/AggregationController';

export const createAggregationRouter = (aggregationController: AggregationController): Router => {
  const router = Router();
  
  router.get(
    '/',
    (req, res) => aggregationController.getAggregations(req, res)
  );
  
  router.get(
    '/top-performing',
    (req, res) => aggregationController.getTopPerforming(req, res)
  );
  
  return router;
};