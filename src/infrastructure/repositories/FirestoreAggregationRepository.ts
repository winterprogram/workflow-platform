import { Aggregation, AggregationKey } from '../../core/domain/entities/Aggregation';
import { EventType } from '../../core/domain/entities/Event';
import { IAggregationRepository } from '../../core/interfaces/repositories/IAggregationRepository';
import { FirestoreClient } from '../database/firestore/FirestoreClient';

export class FirestoreAggregationRepository implements IAggregationRepository {
  private collection = 'aggregations';
  
  constructor(private firestoreClient: FirestoreClient) {}
  
  private createKeyString(key: AggregationKey): string {
    const dimensions = key.dimensions ? 
      Object.entries(key.dimensions)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}:${value}`)
        .join('_') 
      : '';
      
    const timestamp = key.timestamp.toISOString();
    return `${key.eventType}_${key.timeWindow}_${timestamp}${dimensions ? '_' + dimensions : ''}`;
  }
  
  async save(aggregation: Aggregation): Promise<void> {
    const keyString = this.createKeyString(aggregation.key);
    
    await this.firestoreClient.getCollection(this.collection).doc(keyString).set({
      key: {
        eventType: aggregation.key.eventType,
        timeWindow: aggregation.key.timeWindow,
        timestamp: aggregation.key.timestamp,
        dimensions: aggregation.key.dimensions || {}
      },
      count: aggregation.count,
      sum: aggregation.sum,
      avg: aggregation.avg,
      metadata: aggregation.metadata
    });
  }
  
  async findByKey(key: AggregationKey): Promise<Aggregation | null> {
    const keyString = this.createKeyString(key);
    const doc = await this.firestoreClient.getCollection(this.collection).doc(keyString).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data() as any;
    return new Aggregation(
      {
        eventType: data.key.eventType,
        timeWindow: data.key.timeWindow,
        timestamp: data.key.timestamp.toDate(),
        dimensions: data.key.dimensions
      },
      data.count,
      data.sum,
      data.avg,
      data.metadata
    );
  }
  
  async findByTimeWindow(
    windowType: string,
    startTime: Date,
    endTime: Date,
    eventType?: EventType,
    dimensions?: Record<string, string>
  ): Promise<Aggregation[]> {
    let query = this.firestoreClient.getCollection(this.collection)
      .where('key.timeWindow', '==', windowType)
      .where('key.timestamp', '>=', startTime)
      .where('key.timestamp', '<=', endTime);
    
    if (eventType) {
      query = query.where('key.eventType', '==', eventType);
    }
    
    // Firestore doesn't support complex filtering on nested fields
    // So we'll fetch and filter in memory for dimensions
    const snapshot = await query.get();
    
    const aggregations = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return new Aggregation(
          {
            eventType: data.key.eventType,
            timeWindow: data.key.timeWindow,
            timestamp: data.key.timestamp.toDate(),
            dimensions: data.key.dimensions
          },
          data.count,
          data.sum,
          data.avg,
          data.metadata
        );
      })
      .filter(agg => {
        // Filter by dimensions if provided
        if (!dimensions) return true;
        
        return Object.entries(dimensions).every(([key, value]) => 
          agg.key.dimensions && agg.key.dimensions[key] === value
        );
      });
    
    return aggregations;
  }
  
  async getTopPerforming(
    metric: string,
    dimension: string,
    eventType: EventType,
    startTime: Date,
    endTime: Date,
    limit: number
  ): Promise<{ dimensionValue: string; metricValue: number }[]> {
    const aggregations = await this.findByTimeWindow('day', startTime, endTime, eventType);
    
    // Group by dimension and calculate metric value
    const groupedByDimension = new Map<string, number>();
    
    for (const agg of aggregations) {
      const dimensionValue = agg.key.dimensions?.[dimension];
      if (!dimensionValue) continue;
      
      let metricValue = 0;
      
      if (metric === 'count') {
        metricValue = agg.count;
      } else if (metric.startsWith('sum.')) {
        const sumField = metric.split('.')[1];
        metricValue = agg.sum[sumField] || 0;
      } else if (metric.startsWith('avg.')) {
        const avgField = metric.split('.')[1];
        metricValue = agg.avg[avgField] || 0;
      }
      
      // Add to grouped map
      const current = groupedByDimension.get(dimensionValue) || 0;
      groupedByDimension.set(dimensionValue, current + metricValue);
    }
    
    // Convert to array and sort
    const result = Array.from(groupedByDimension.entries())
      .map(([dimensionValue, metricValue]) => ({ dimensionValue, metricValue }))
      .sort((a, b) => b.metricValue - a.metricValue)
      .slice(0, limit);
    
    return result;
  }
}