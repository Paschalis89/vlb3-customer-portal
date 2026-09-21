import { ChevronRight, CircleCheck, Clock3, MapPin } from 'lucide-react';
import { formatDateTime, formatRelativeTime } from '../../lib/date';
import { getAlertSeverityLabel, getAlertSeverityTone } from '../../lib/alerts';
import type { CustomerAlert } from '../../types/alert';
import { StatusBadge } from '../ui/StatusBadge';

interface AlertCardProps {
  alert: CustomerAlert;
  onOpen: (alert: CustomerAlert) => void;
}

export function AlertCard({ alert, onOpen }: AlertCardProps) {
  const isResolved = alert.status === 'RESOLVED';

  return (
    <article className={`alert-card${isResolved ? ' alert-card--resolved' : ''}`}>
      <div className="alert-card__top">
        <div className="alert-card__badges">
          <StatusBadge
            label={getAlertSeverityLabel(alert.severity)}
            tone={getAlertSeverityTone(alert.severity)}
          />
          {isResolved ? <StatusBadge label="Risolto" tone="success" /> : null}
        </div>
        <span className="alert-card__relative-time">{formatRelativeTime(alert.occurredAt)}</span>
      </div>

      <div className="alert-card__content">
        <span className="alert-card__site">
          <MapPin size={15} />
          {alert.siteName}
          {alert.deviceName ? ` · ${alert.deviceName}` : ''}
        </span>

        <h3>{alert.title}</h3>
        <p>{alert.message}</p>

        <div className="alert-card__meta">
          <span>
            <Clock3 size={15} />
            {formatDateTime(alert.occurredAt)}
          </span>
          {alert.resolvedAt ? (
            <span className="alert-card__resolved-meta">
              <CircleCheck size={15} />
              Risolto {formatRelativeTime(alert.resolvedAt)}
            </span>
          ) : null}
        </div>
      </div>

      <button className="alert-card__open" type="button" onClick={() => onOpen(alert)}>
        Apri dettaglio
        <ChevronRight size={17} />
      </button>
    </article>
  );
}
