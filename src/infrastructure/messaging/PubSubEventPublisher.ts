import { IEventPublisher } from '../../core/interfaces/messaging/IEventPublisher';
import { Event } from '../../core/domain/entities/Event';
import { GooglePubSubClient } from '../pubsub/GooglePubSubClient';
import { ILogger } from '../../core/interfaces/logging/ILogger';

export class PubSubEventPublisher implements IEventPublisher {
  private readonly topicName = 'lead-events';
  
  constructor(
    private pubSubClient: GooglePubSubClient,
    private logger: ILogger
  ) {}
  
  async publish(event: Event): Promise<void> {
    try {
      const messageId = await this.pubSubClient.publishMessage(this.topicName, {
        id: event.id,
        type: event.type,
        payload: event.payload,
        timestamp: event.timestamp.toISOString()
      });
      
      this.logger.info(`Published event ${event.id} with message ID ${messageId}`);
    } catch (error) {
      this.logger.error(`Failed to publish event ${event.id}`, error);
      throw error;
    }
  }
}