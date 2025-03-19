import { Request, Response } from 'express';
import { Event, EventType } from '../../core/domain/entities/Event';
import { ProcessEventUseCase } from '../../core/use-cases/ProcessEventUseCase';
import { IEventPublisher } from '../../core/interfaces/messaging/IEventPublisher';
import { v4 as uuidv4 } from 'uuid';
import { ILogger } from '../../core/interfaces/logging/ILogger';

export class EventController {
  constructor(
    private processEventUseCase: ProcessEventUseCase,
    private eventPublisher: IEventPublisher,
    private logger: ILogger
  ) {}
  
  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const { type, payload } = req.body;
      
      if (!type || !Object.values(EventType).includes(type as EventType)) {
        res.status(400).json({ error: 'Invalid event type' });
        return;
      }
      
      const event = Event.create(
        req.body.id || uuidv4(),
        type as EventType,
        payload,
        new Date(req.body.timestamp || Date.now())
      );
      
      // Publish event to PubSub
      await this.eventPublisher.publish(event);
      
      res.status(202).json({ 
        message: 'Event received',
        eventId: event.id 
      });
    } catch (error) {
      this.logger.error('Error creating event', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}