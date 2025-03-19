import { EventType, Event } from './Event';

export interface AggregationKey {
  eventType: EventType;
  timeWindow: string; // 'hour', 'day'
  timestamp: Date;
  dimensions?: {
    regionId?: string;
    campaignId?: string;
    [key: string]: any;
  };
}

export class Aggregation {
  constructor(
    public readonly key: AggregationKey,
    public count: number = 0,
    public sum: Record<string, number> = {},
    public avg: Record<string, number> = {},
    public metadata: Record<string, any> = {}
  ) {}

  addEvent(event: Event): void {
    this.count++;
    
    // Update sum for numeric fields
    if (event.payload.revenue) {
      this.sum['revenue'] = (this.sum['revenue'] || 0) + event.payload.revenue;
    }
    
    // Additional aggregation logic can be added here
  }
}