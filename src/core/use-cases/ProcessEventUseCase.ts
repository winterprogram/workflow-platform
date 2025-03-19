import { Event } from '../domain/entities/Event';
import { IEventRepository } from '../interfaces/repositories/IEventRepository';

export class ProcessEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(event: Event): Promise<void> {
    await this.eventRepository.save(event);
  }
}