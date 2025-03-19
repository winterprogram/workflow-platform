import { Counter, Gauge, Registry } from 'prom-client';

export class MetricsService {
  private registry: Registry;
  
  // Counters
  public eventsReceived: Counter;
  public eventsProcessed: Counter;
  public eventsErrored: Counter;
  
  // Gauges
  public processingLatency: Gauge;
  public aggregationLatency: Gauge;
  
  constructor() {
    this.registry = new Registry();
    
    // Initialize metrics
    this.eventsReceived = new Counter({
      name: 'events_received_total',
      help: 'Total number of events received',
      labelNames: ['event_type'],
      registers: [this.registry]
    });
    
    this.eventsProcessed = new Counter({
      name: 'events_processed_total',
      help: 'Total number of events processed successfully',
      labelNames: ['event_type'],
      registers: [this.registry]
    });
    
    this.eventsErrored = new Counter({
      name: 'events_errored_total',
      help: 'Total number of events that failed processing',
      labelNames: ['event_type', 'error_type'],
      registers: [this.registry]
    });
    
    this.processingLatency = new Gauge({
      name: 'event_processing_latency_seconds',
      help: 'Time taken to process an event in seconds',
      labelNames: ['event_type'],
      registers: [this.registry]
    });
    
    this.aggregationLatency = new Gauge({
      name: 'event_aggregation_latency_seconds',
      help: 'Time taken to aggregate an event in seconds',
      labelNames: ['window_type'],
      registers: [this.registry]
    });
  }
  
  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}