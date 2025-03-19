import { Aggregation } from '../domain/entities/Aggregation';
import { EventType } from '../domain/entities/Event';
import { IAggregationRepository } from '../interfaces/repositories/IAggregationRepository';

export class GetAggregationsUseCase {
  constructor(private aggregationRepository: IAggregationRepository) {}

  async execute(
    windowType: string,
    startTime: Date,
    endTime: Date,
    eventType?: EventType,
    dimensions?: Record<string, string>
  ): Promise<Aggregation[]> {
    return this.aggregationRepository.findByTimeWindow(
      windowType,
      startTime,
      endTime,
      eventType,
      dimensions
    );
  }
}