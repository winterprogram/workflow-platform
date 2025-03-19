import { Router } from 'express';
import { EventController } from '../../../adapters/controllers/EventController';
import { validateEventSchema } from '../../middlewares/validation';

export const createEventRouter = (eventController: EventController): Router => {
  const router = Router();
  
  router.post(
    '/',
    validateEventSchema,
    (req, res) => eventController.createEvent(req, res)
  );
  
  return router;
};