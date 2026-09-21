import type {
  CustomerHistoryCategory,
  CustomerHistoryEvent,
  CustomerHistoryEventType,
} from '../types/history';

export interface HistoryDayGroup {
  key: string;
  label: string;
  events: CustomerHistoryEvent[];
}

function startOfDay(value: Date): number {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
}

export function historyDayLabel(value: string, now = new Date()): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data non disponibile';
  }

  const differenceDays = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

  if (differenceDays === 0) {
    return 'Oggi';
  }

  if (differenceDays === 1) {
    return 'Ieri';
  }

  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  }).format(date);
}

export function groupHistoryEvents(events: CustomerHistoryEvent[]): HistoryDayGroup[] {
  const groups = new Map<string, HistoryDayGroup>();

  for (const event of events) {
    const date = new Date(event.occurredAt);
    const key = Number.isNaN(date.getTime())
      ? 'unknown'
      : `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    const existing = groups.get(key);
    if (existing) {
      existing.events.push(event);
      continue;
    }

    groups.set(key, {
      key,
      label: historyDayLabel(event.occurredAt),
      events: [event],
    });
  }

  return Array.from(groups.values());
}

export function historyCategoryLabel(category: CustomerHistoryCategory): string {
  switch (category) {
    case 'PUMP':
      return 'Pompe';
    case 'FREQUENCY':
      return 'Frequenza';
    case 'ALERT':
      return 'Allarmi';
    case 'CONNECTIVITY':
      return 'Connessione';
  }
}

export function historyEventTone(
  type: CustomerHistoryEventType,
): 'success' | 'danger' | 'warning' | 'neutral' | 'primary' {
  switch (type) {
    case 'PUMP_STARTED':
    case 'DEVICE_ONLINE':
      return 'success';
    case 'PUMP_STOPPED':
      return 'danger';
    case 'ALERT_RESOLVED':
      return 'warning';
    case 'FREQUENCY_CHANGED':
      return 'primary';
    case 'DEVICE_OFFLINE':
      return 'neutral';
  }
}
