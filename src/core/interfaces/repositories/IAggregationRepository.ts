import { Aggregation, AggregationKey } from "../../domain/entities/Aggregation";
import { EventType } from "../../domain/entities/Event";

export interface IAggregationRepository {
  save(aggregation: Aggregation): Promise<void>;
  findByKey(key: AggregationKey): Promise<Aggregation | null>;
  findByTimeWindow(
    windowType: string,
    startTime: Date,
    endTime: Date,
    eventType?: EventType,
    dimensions?: Record<string, string>
  ): Promise<Aggregation[]>;
  getTopPerforming(
    metric: string,
    dimension: string,
    eventType: EventType,
    startTime: Date,
    endTime: Date,
    limit: number
  ): Promise<{ dimensionValue: string; metricValue: number }[]>;
}
