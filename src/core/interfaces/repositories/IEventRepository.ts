import { Event } from "../../domain/entities/Event";

export interface IEventRepository {
  save(event: Event): Promise<void>;
  findById(id: string): Promise<Event | null>;
}
