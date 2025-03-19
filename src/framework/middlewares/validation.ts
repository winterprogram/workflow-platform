import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { EventType } from '../../core/domain/entities/Event';

// Event schema validation
const eventSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  type: Joi.string().valid(...Object.values(EventType)).required(),
  payload: Joi.object().required(),
  timestamp: Joi.date().iso().optional()
});

export const validateEventSchema = (req: Request, res: Response, next: NextFunction) => {
  const { error } = eventSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
};