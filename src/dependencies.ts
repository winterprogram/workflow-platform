import { PinoLogger } from "./infrastructure/logging/PinoLogger";
import { FirestoreClient } from "./infrastructure/database/firestore/FirestoreClient";
import { FirestoreEventRepository } from "./infrastructure/repositories/FirestoreEventRepository";
import { FirestoreAggregationRepository } from "./infrastructure/repositories/FirestoreAggregationRepository";
import { GooglePubSubClient } from "./infrastructure/pubsub/GooglePubSubClient";
import { PubSubEventPublisher } from "./infrastructure/messaging/PubSubEventPublisher";
import { PubSubEventSubscriber } from "./infrastructure/messaging/PubSubEventSubscriber";
import { ProcessEventUseCase } from "./core/use-cases/ProcessEventUseCase";
import { AggregateEventsUseCase } from "./core/use-cases/AggregateEventsUseCase";
import { GetAggregationsUseCase } from "./core/use-cases/GetAggregationsUseCase";
import { GetTopPerformingUseCase } from "./core/use-cases/GetTopPerformingUseCase";
import { EventController } from "./adapters/controllers/EventController";
import { AggregationController } from "./adapters/controllers/AggregationController";
import { EventHandler } from "./adapters/handlers/EventHandler";
import { MetricsService } from "./framework/observability/metrics";
import { ILogger } from "./core/interfaces/logging/ILogger";
import { IEventHandler } from "./core/interfaces/messaging/IEventSubscriber";

export class DependencyContainer {
  // Infrastructure
  private readonly logger: PinoLogger;
  private readonly firestoreClient: FirestoreClient;
  private readonly eventRepository: FirestoreEventRepository;
  private readonly aggregationRepository: FirestoreAggregationRepository;
  private readonly pubSubClient: GooglePubSubClient;
  private readonly eventPublisher: PubSubEventPublisher;
  private readonly eventSubscriber: PubSubEventSubscriber;

  // Use Cases
  private readonly processEventUseCase: ProcessEventUseCase;
  private readonly aggregateEventsUseCase: AggregateEventsUseCase;
  private readonly getAggregationsUseCase: GetAggregationsUseCase;
  private readonly getTopPerformingUseCase: GetTopPerformingUseCase;

  // Controllers
  private readonly eventController: EventController;
  private readonly aggregationController: AggregationController;

  // Handlers
  private readonly eventHandler: EventHandler;

  // Observability
  private readonly metricsService: MetricsService;

  constructor() {
    // Infrastructure setup
    this.logger = new PinoLogger();
    this.firestoreClient = new FirestoreClient();
    this.eventRepository = new FirestoreEventRepository(this.firestoreClient);
    this.aggregationRepository = new FirestoreAggregationRepository(
      this.firestoreClient
    );
    this.pubSubClient = new GooglePubSubClient(this.logger);
    this.eventPublisher = new PubSubEventPublisher(
      this.pubSubClient,
      this.logger
    );
    this.eventSubscriber = new PubSubEventSubscriber(
      this.pubSubClient,
      this.logger
    );

    // Use Cases setup
    this.processEventUseCase = new ProcessEventUseCase(this.eventRepository);
    this.aggregateEventsUseCase = new AggregateEventsUseCase(
      this.aggregationRepository
    );
    this.getAggregationsUseCase = new GetAggregationsUseCase(
      this.aggregationRepository
    );
    this.getTopPerformingUseCase = new GetTopPerformingUseCase(
      this.aggregationRepository
    );

    // Controllers setup
    this.eventController = new EventController(
      this.processEventUseCase,
      this.eventPublisher,
      this.logger
    );
    this.aggregationController = new AggregationController(
      this.getAggregationsUseCase,
      this.getTopPerformingUseCase,
      this.logger
    );

    // Handlers setup
    this.eventHandler = new EventHandler(
      this.processEventUseCase,
      this.aggregateEventsUseCase,
      this.logger
    );

    // Observability setup
    this.metricsService = new MetricsService();
  }

  getLogger(): ILogger {
    return this.logger;
  }

  getEventController(): EventController {
    return this.eventController;
  }

  getAggregationController(): AggregationController {
    return this.aggregationController;
  }

  getEventSubscriber() {
    return this.eventSubscriber;
  }

  getEventHandler(): IEventHandler {
    return this.eventHandler;
  }

  getMetricsService(): MetricsService {
    return this.metricsService;
  }
}
