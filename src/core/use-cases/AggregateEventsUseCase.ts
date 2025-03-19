import { Aggregation, AggregationKey } from '../domain/entities/Aggregation';
import { Event, EventType } from '../domain/entities/Event';
import { IAggregationRepository } from '../interfaces/repositories/IAggregationRepository';

export class AggregateEventsUseCase {
  constructor(private aggregationRepository: IAggregationRepository) {}

  async execute(event: Event): Promise<void> {
    // Create hourly aggregation key
    const hourlyKey = this.createAggregationKey(event, 'hour');
    await this.updateAggregation(hourlyKey, event);

    // Create daily aggregation key
    const dailyKey = this.createAggregationKey(event, 'day');
    await this.updateAggregation(dailyKey, event);
  }

  private createAggregationKey(event: Event, windowType: 'hour' | 'day'): AggregationKey {
    const timestamp = new Date(event.timestamp);
    
    // Normalize timestamp for the time window
    if (windowType === 'hour') {
      timestamp.setMinutes(0, 0, 0);
    } else if (windowType === 'day') {
      timestamp.setHours(0, 0, 0, 0);
    }

    return {
      eventType: event.type,
      timeWindow: windowType,
      timestamp,
      dimensions: {
        regionId: event.payload.regionId,
        campaignId: event.payload.campaignId
      }
    };
  }

  private async updateAggregation(key: AggregationKey, event: Event): Promise<void> {
    // Find existing aggregation or create a new one
    let aggregation = await this.aggregationRepository.findByKey(key);
    
    if (!aggregation) {
      aggregation = new Aggregation(key);
    }
    
    // Update aggregation with event data
    aggregation.addEvent(event);
    
    // Save updated aggregation
    await this.aggregationRepository.save(aggregation);
  }
}