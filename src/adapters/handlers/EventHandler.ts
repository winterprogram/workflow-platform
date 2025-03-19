import { Event } from '../../core/domain/entities/Event';
import { IEventHandler } from '../../core/interfaces/messaging/IEventSubscriber';
import { ProcessEventUseCase } from '../../core/use-cases/ProcessEventUseCase';
import { AggregateEventsUseCase } from '../../core/use-cases/AggregateEventsUseCase';
import { ILogger } from '../../core/interfaces/logging/ILogger';

export class EventHandler implements IEventHandler {
  constructor(
    private processEventUseCase: ProcessEventUseCase,
    private aggregateEventsUseCase: AggregateEventsUseCase,
    private logger: ILogger
  ) {}
  
  async handle(event: Event): Promise<void> {
    try {
      // Process and save the raw event
      await this.processEventUseCase.execute(event);
      
      // Aggregate the event
      await this.aggregateEventsUseCase.execute(event);
      
      this.logger.info(`Event ${event.id} processed and aggregated successfully`);
    } catch (error) {
      this.logger.error(`Error handling event ${event.id}`, error);
      throw error; // Re-throw to trigger retry/nack
    }
  }
}