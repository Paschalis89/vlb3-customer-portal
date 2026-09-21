import {
  AlertTriangle,
  Building2,
  CircleStop,
  Gauge,
  Power,
  Radio,
  UserRound,
  Wifi,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { formatDateTime, formatRelativeTime, formatTime } from '../../lib/date';
import { historyEventTone } from '../../lib/history';
import type { CustomerHistoryEvent, CustomerHistoryEventType } from '../../types/history';

interface HistoryEventItemProps {
  event: CustomerHistoryEvent;
}

function eventIcon(type: CustomerHistoryEventType): LucideIcon {
  switch (type) {
    case 'PUMP_STARTED':
      return Power;
    case 'PUMP_STOPPED':
      return CircleStop;
    case 'FREQUENCY_CHANGED':
      return Gauge;
    case 'ALERT_RESOLVED':
      return AlertTriangle;
    case 'DEVICE_OFFLINE':
      return Radio;
    case 'DEVICE_ONLINE':
      return Wifi;
  }
}

export function HistoryEventItem({ event }: HistoryEventItemProps) {
  const Icon = eventIcon(event.type);
  const tone = historyEventTone(event.type);

  return (
    <article className="history-event">
      <div className={`history-event__marker history-event__marker--${tone}`} aria-hidden="true">
        <Icon size={18} />
      </div>

      <div className="history-event__body">
        <div className="history-event__top">
          <div>
            <span className="history-event__time">{formatTime(event.occurredAt)}</span>
            <h3>{event.title}</h3>
          </div>
          <span className="history-event__relative">{formatRelativeTime(event.occurredAt)}</span>
        </div>

        <p>{event.description}</p>

        <div className="history-event__meta">
          <span>
            <Building2 size={15} />
            {event.siteName}
            {event.deviceName ? ` · ${event.deviceName}` : ''}
          </span>

          {event.actor ? (
            <span>
              <UserRound size={15} />
              {event.actor.name}
            </span>
          ) : (
            <span className="history-event__system">Evento automatico</span>
          )}
        </div>

        <span className="history-event__exact" title={formatDateTime(event.occurredAt)}>
          {formatDateTime(event.occurredAt)}
        </span>
      </div>
    </article>
  );
}
