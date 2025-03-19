export const TYPES = {
  // Core
  Logger: Symbol.for('Logger'),
  
  // Infrastructure
  FirestoreClient: Symbol.for('FirestoreClient'),
  PubSubClient: Symbol.for('PubSubClient'),
  EventRepository: Symbol.for('EventRepository'),
  AggregationRepository: Symbol.for('AggregationRepository'),
  EventPublisher: Symbol.for('EventPublisher'),
  EventSubscriber: Symbol.for('EventSubscriber'),
  
  // Use Cases
  ProcessEventUseCase: Symbol.for('ProcessEventUseCase'),
  AggregateEventsUseCase: Symbol.for('AggregateEventsUseCase'),
  GetAggregationsUseCase: Symbol.for('GetAggregationsUseCase'),
  GetTopPerformingUseCase: Symbol.for('GetTopPerformingUseCase'),
  
  // Controllers
  EventController: Symbol.for('EventController'),
  AggregationController: Symbol.for('AggregationController'),
  
  // Handlers
  EventHandler: Symbol.for('EventHandler'),
  
  // Observability
  MetricsService: Symbol.for('MetricsService')
};