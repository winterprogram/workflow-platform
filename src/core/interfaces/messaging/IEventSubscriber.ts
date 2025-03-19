import { Event } from '../../domain/entities/Event';

export interface IEventHandler {
  handle(event: Event): Promise<void>;
}

export interface IEventSubscriber {
  subscribe(handler: IEventHandler): Promise<void>;
}