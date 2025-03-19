import "dotenv/config";
import { DependencyContainer } from "./dependencies";
import { createApp } from "./app";

const PORT = process.env.PORT || 3000;

async function startServer() {
  const dependencies = new DependencyContainer();
  const logger = dependencies.getLogger();

  try {
    // Create Express app
    const app = createApp(
      logger,
      dependencies.getEventController(),
      dependencies.getAggregationController(),
      dependencies.getMetricsService()
    );

    // Start event subscriber
    const eventSubscriber = dependencies.getEventSubscriber();
    const eventHandler = dependencies.getEventHandler();

    await eventSubscriber.subscribe(eventHandler);
    logger.info("Event subscriber started");

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
