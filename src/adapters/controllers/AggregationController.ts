import { Request, Response } from 'express';
import { EventType } from '../../core/domain/entities/Event';
import { GetAggregationsUseCase } from '../../core/use-cases/GetAggregationsUseCase';
import { GetTopPerformingUseCase } from '../../core/use-cases/GetTopPerformingUseCase';
import { ILogger } from '../../core/interfaces/logging/ILogger';

export class AggregationController {
  constructor(
    private getAggregationsUseCase: GetAggregationsUseCase,
    private getTopPerformingUseCase: GetTopPerformingUseCase,
    private logger: ILogger
  ) {}
  
  async getAggregations(req: Request, res: Response): Promise<void> {
    try {
      const { window, startTime, endTime, type } = req.query;
      
      // Validate required parameters
      if (!window || !['hour', 'day'].includes(window as string)) {
        res.status(400).json({ error: 'Invalid window parameter. Must be "hour" or "day".' });
        return;
      }
      
      if (!startTime || !endTime) {
        res.status(400).json({ error: 'startTime and endTime parameters are required' });
        return;
      }
      
      // Parse timestamps
      const start = new Date(startTime as string);
      const end = new Date(endTime as string);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({ error: 'Invalid date format for startTime or endTime' });
        return;
      }
      
      // Parse event type
      let eventType: EventType | undefined;
      if (type) {
        if (!Object.values(EventType).includes(type as EventType)) {
          res.status(400).json({ error: 'Invalid event type' });
          return;
        }
        eventType = type as EventType;
      }
      
      // Extract dimension filters
      const dimensions: Record<string, string> = {};
      for (const key of Object.keys(req.query)) {
        if (['regionId', 'campaignId'].includes(key)) {
          dimensions[key] = req.query[key] as string;
        }
      }
      
      // Get aggregations
      const aggregations = await this.getAggregationsUseCase.execute(
        window as string,
        start,
        end,
        eventType,
        Object.keys(dimensions).length > 0 ? dimensions : undefined
      );
      
      res.status(200).json({
        window,
        startTime: start,
        endTime: end,
        type: eventType,
        dimensions: dimensions,
        aggregations: aggregations.map(agg => ({
          timestamp: agg.key.timestamp,
          count: agg.count,
          sum: agg.sum,
          avg: agg.avg
        }))
      });
    } catch (error) {
      this.logger.error('Error getting aggregations', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async getTopPerforming(req: Request, res: Response): Promise<void> {
    try {
      const { 
        metric, 
        dimension, 
        type, 
        startTime, 
        endTime,
        limit = '10'
      } = req.query;
      
      // Validate required parameters
      if (!metric || !['count', 'sum.revenue'].includes(metric as string)) {
        res.status(400).json({ 
          error: 'Invalid metric parameter. Must be "count" or "sum.revenue"' 
        });
        return;
      }
      
      if (!dimension || !['regionId', 'campaignId'].includes(dimension as string)) {
        res.status(400).json({ 
          error: 'Invalid dimension parameter. Must be "regionId" or "campaignId"' 
        });
        return;
      }
      
      if (!type || !Object.values(EventType).includes(type as EventType)) {
        res.status(400).json({ error: 'Invalid event type' });
        return;
      }
      
      if (!startTime || !endTime) {
        res.status(400).json({ error: 'startTime and endTime parameters are required' });
        return;
      }
      
      // Parse timestamps
      const start = new Date(startTime as string);
      const end = new Date(endTime as string);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({ error: 'Invalid date format for startTime or endTime' });
        return;
      }
      
      // Parse limit
      const limitNum = parseInt(limit as string, 10);
      if (isNaN(limitNum) || limitNum <= 0) {
        res.status(400).json({ error: 'Invalid limit parameter' });
        return;
      }
      
      // Get top performing
      const results = await this.getTopPerformingUseCase.execute(
        metric as string,
        dimension as string,
        type as EventType,
        start,
        end,
        limitNum
      );
      
      res.status(200).json({
        metric,
        dimension,
        type,
        startTime: start,
        endTime: end,
        results
      });
    } catch (error) {
      this.logger.error('Error getting top performing', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}