# Lead Workflow Platform

A scalable system to process real-time event streams, aggregate them into fixed time windows, and provide an API for querying the aggregated data.

## Features

- Real-time event ingestion using GCP Pub/Sub
- Event processing and aggregation into hourly and daily windows
- Firestore storage for aggregated results
- RESTful APIs for querying aggregated data
- Scalability to handle 100K events per minute
- Observability metrics for monitoring system performance

## Architecture

The application follows clean architecture principles with the following layers:

1. **Core Layer**
   - Domain entities and business rules
   - Use cases that define application behavior
   - Interface definitions for external dependencies

2. **Infrastructure Layer**
   - Implementations of repository interfaces
   - Event publishing and subscription mechanisms
   - Database access and external service interactions

3. **Adapters Layer**
   - Controllers to handle HTTP requests
   - Event handlers to process incoming events

4. **Framework Layer**
   - Express application setup
   - Routes configuration
   - Dependency injection container
   - Observability and logging setup

## Setup Instructions

### Prerequisites

- Node.js 18+
- Google Cloud Platform account
- GCP Project with Pub/Sub and Firestore enabled
- Service account with appropriate permissions

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd lead-workflow-platform
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your GCP configuration
   ```

4. Add your GCP service account key file to the project root
   ```bash
   # Place service-account.json in the project root
   ```

5. Build the application
   ```bash
   npm run build
   ```

6. Start the server
   ```bash
   npm start
   ```

## API Endpoints

### Events API

- **POST /api/events**
  - Create a new event
  - Request body:
    ```json
    {
      "type": "EMAIL_SENT",
      "payload": {
        "userId": "user123",
        "campaignId": "campaign456",
        "regionId": "us-west"
      }
    }
    ```

### Aggregations API

- **GET /api/aggregations**
  - Get aggregated data for specific criteria
  - Query parameters:
    - window: "hour" or "day" (required)
    - startTime: ISO timestamp (required)
    - endTime: ISO timestamp (required)
    - type: Event type (optional)
    - regionId, campaignId: Additional filters (optional)

- **GET /api/aggregations/top-performing**
  - Get top performing dimensions
  - Query parameters:
    - metric: "count" or "sum.revenue" (required)
    - dimension: "regionId" or "campaignId" (required)
    - type: Event type (required)
    - startTime: ISO timestamp (required)
    - endTime: ISO timestamp (required)
    - limit: Number of results (optional, default: 10)

### Metrics API

- **GET /metrics**
  - Get Prometheus-formatted metrics

## Testing

Run the test suite:

```bash
npm test
```

## Design Decisions

- **Repository Pattern**: Abstracting data access through repository interfaces
- **Observer Pattern**: Using Pub/Sub for event-driven communication
- **Factory Pattern**: Creating entities through static factory methods

## Monitoring and Observability

The application includes:
- Prometheus metrics for monitoring event processing
- Structured logging with Pino
- Health check endpoint for monitoring system health

## Scaling Considerations

- Horizontal scaling of API servers
- Auto-scaling of Pub/Sub subscribers based on message volume
- Efficient data modeling in Firestore for high-throughput queries
- In-memory caching for frequently accessed aggregations