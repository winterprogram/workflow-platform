export enum EventType {
  LEAD_CREATED = "LEAD_CREATED",
  LEAD_UPDATED = "LEAD_UPDATED",
  EMAIL_SENT = "EMAIL_SENT",
  EMAIL_OPENED = "EMAIL_OPENED",
  FORM_SUBMITTED = "FORM_SUBMITTED",
  APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED",
}

export interface EventPayload {
  userId?: string;
  regionId?: string;
  campaignId?: string;
  revenue?: number;
  emailId?: string;
  [key: string]: any;
}

export class Event {
  constructor(
    public readonly id: string,
    public readonly type: EventType,
    public readonly payload: EventPayload,
    public readonly timestamp: Date
  ) {}

  static create(
    id: string,
    type: EventType,
    payload: EventPayload,
    timestamp: Date
  ): Event {
    if (!id) throw new Error("Event ID is required");
    if (!type) throw new Error("Event type is required");
    if (!timestamp) throw new Error("Timestamp is required");

    return new Event(id, type, payload, timestamp);
  }
}
