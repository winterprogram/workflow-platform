import { Event } from '../../domain/entities/Event';

export interface IEventPublisher {
  publish(event: Event): Promise<void>;
}
