export type CustomerHistoryEventType =
  | 'PUMP_STARTED'
  | 'PUMP_STOPPED'
  | 'FREQUENCY_CHANGED'
  | 'ALERT_RESOLVED'
  | 'DEVICE_OFFLINE'
  | 'DEVICE_ONLINE';

export type CustomerHistoryCategory =
  | 'PUMP'
  | 'FREQUENCY'
  | 'ALERT'
  | 'CONNECTIVITY';

export type CustomerHistoryFilter = 'ALL' | CustomerHistoryCategory;

export interface CustomerHistoryActor {
  id: string | null;
  name: string;
}

export interface CustomerHistoryEvent {
  id: string;
  type: CustomerHistoryEventType;
  category: CustomerHistoryCategory;
  occurredAt: string;
  siteId: string;
  siteName: string;
  deviceId: string | null;
  deviceName: string | null;
  title: string;
  description: string;
  actor: CustomerHistoryActor | null;
  frequencyHz: number | null;
}

export interface CustomerHistoryResponse {
  generatedAt: string;
  events: CustomerHistoryEvent[];
}
