import { IEventRepository } from '../../core/interfaces/repositories/IEventRepository';
import { Event, EventType, EventPayload } from '../../core/domain/entities/Event';
import { FirestoreClient } from '../database/firestore/FirestoreClient';

export class FirestoreEventRepository implements IEventRepository {
  private collection = 'events';
  
  constructor(private firestoreClient: FirestoreClient) {}
  
  async save(event: Event): Promise<void> {
    await this.firestoreClient.getCollection(this.collection).doc(event.id).set({
      id: event.id,
      type: event.type,
      payload: event.payload,
      timestamp: event.timestamp
    });
  }
  
  async findById(id: string): Promise<Event | null> {
    const doc = await this.firestoreClient.getCollection(this.collection).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data() as any;
    return new Event(
      data.id,
      data.type as EventType,
      data.payload as EventPayload,
      data.timestamp.toDate()
    );
  }
}