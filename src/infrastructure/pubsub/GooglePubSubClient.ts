import { PubSub, Message } from '@google-cloud/pubsub';
import { ILogger } from '../../core/interfaces/logging/ILogger';

export class GooglePubSubClient {
  private pubSub: PubSub;
  
  constructor(private logger: ILogger) {
    this.pubSub = new PubSub();
  }
  
  async createTopic(topicName: string): Promise<void> {
    try {
      await this.pubSub.createTopic(topicName);
      this.logger.info(`Topic ${topicName} created.`);
    } catch (error: any) {
      if (error.code === 6) { // ALREADY_EXISTS
        this.logger.info(`Topic ${topicName} already exists.`);
      } else {
        throw error;
      }
    }
  }
  
  async publishMessage(topicName: string, data: Record<string, any>): Promise<string> {
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const messageId = await this.pubSub.topic(topicName).publish(dataBuffer);
    return messageId;
  }
  
  async subscribe(
    subscriptionName: string, 
    topicName: string, 
    handleMessage: (message: Message) => Promise<void>
  ): Promise<void> {
    // Ensure topic exists
    await this.createTopic(topicName);
    
    // Create subscription if it doesn't exist
    try {
      await this.pubSub.createSubscription(topicName, subscriptionName);
      this.logger.info(`Subscription ${subscriptionName} created.`);
    } catch (error: any) {
      if (error.code === 6) { // ALREADY_EXISTS
        this.logger.info(`Subscription ${subscriptionName} already exists.`);
      } else {
        throw error;
      }
    }
    
    // Subscribe to the topic
    const subscription = this.pubSub.subscription(subscriptionName);
    
    subscription.on('message', async (message: Message) => {
      try {
        await handleMessage(message);
        message.ack();
      } catch (error) {
        this.logger.error('Error processing message', error);
        message.nack();
      }
    });
    
    subscription.on('error', (error) => {
      this.logger.error('Subscription error', error);
    });
    
    this.logger.info(`Listening for messages on ${subscriptionName}`);
  }
}