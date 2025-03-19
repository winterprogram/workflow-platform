import { Message } from '@google-cloud/pubsub';
import { IEventSubscriber, IEventHandler } from '../../core/interfaces/messaging/IEventSubscriber';
import { Event, EventType } from '../../core/domain/entities/Event';
import { GooglePubSubClient } from '../pubsub/GooglePubSubClient';
import { ILogger } from '../../core/interfaces/logging/ILogger';

export class PubSubEventSubscriber implements IEventSubscriber {
  private readonly topicName = 'lead-events';
  private readonly subscriptionName = 'lead-events-processor';
  
  constructor(
    private pubSubClient: GooglePubSubClient,
    private logger: ILogger
  ) {}
  
  async subscribe(handler: IEventHandler): Promise<void> {
    await this.pubSubClient.subscribe(
      this.subscriptionName,
      this.topicName,
      async (message: Message) => {
        try {
          const data = JSON.parse(message.data.toString());
          
          const event = new Event(
            data.id,
            data.type as EventType,
            data.payload,
            new Date(data.timestamp)
          );
          
          await handler.handle(event);
          this.logger.info(`Processed event ${event.id}`);
        } catch (error) {
          this.logger.error('Error processing message', error);
          throw error; // Re-throw to trigger nack
        }
      }
    );
  }
}