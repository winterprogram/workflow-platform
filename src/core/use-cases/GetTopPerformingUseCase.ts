import { EventType } from '../domain/entities/Event';
import { IAggregationRepository } from '../interfaces/repositories/IAggregationRepository';

export class GetTopPerformingUseCase {
  constructor(private aggregationRepository: IAggregationRepository) {}

  async execute(
    metric: string,
    dimension: string,
    eventType: EventType,
    startTime: Date,
    endTime: Date,
    limit: number
  ): Promise<{ dimensionValue: string; metricValue: number }[]> {
    return this.aggregationRepository.getTopPerforming(
      metric,
      dimension,
      eventType,
      startTime,
      endTime,
      limit
    );
  }
}