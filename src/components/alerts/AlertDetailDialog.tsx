import { CircleCheck, Clock3, MapPin, ShieldAlert, X } from 'lucide-react';
import { formatDateTime } from '../../lib/date';
import { getAlertSeverityLabel, getAlertSeverityTone } from '../../lib/alerts';
import type { CustomerAlert } from '../../types/alert';
import { StatusBadge } from '../ui/StatusBadge';

interface AlertDetailDialogProps {
  alert: CustomerAlert | null;
  onClose: () => void;
}

export function AlertDetailDialog({ alert, onClose }: AlertDetailDialogProps) {
  if (!alert) {
    return null;
  }

  const isResolved = alert.status === 'RESOLVED';

  return (
    <div className="alert-detail__backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="alert-detail-title"
        aria-modal="true"
        className="alert-detail"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="alert-detail__header">
          <div className="alert-detail__icon" aria-hidden="true">
            <ShieldAlert size={22} />
          </div>
          <button className="alert-detail__close" type="button" onClick={onClose} aria-label="Chiudi">
            <X size={20} />
          </button>
        </div>

        <div className="alert-detail__badges">
          <StatusBadge
            label={getAlertSeverityLabel(alert.severity)}
            tone={getAlertSeverityTone(alert.severity)}
          />
          {isResolved ? <StatusBadge label="Risolto" tone="success" /> : null}
        </div>

        <h2 id="alert-detail-title">{alert.title}</h2>
        <p className="alert-detail__message">{alert.message}</p>

        <div className="alert-detail__location">
          <MapPin size={17} />
          <div>
            <strong>{alert.siteName}</strong>
            {alert.deviceName ? <span>{alert.deviceName}</span> : null}
          </div>
        </div>

        <div className="alert-detail__timeline">
          <div>
            <Clock3 size={17} />
            <span>
              <small>Rilevato</small>
              <strong>{formatDateTime(alert.occurredAt)}</strong>
            </span>
          </div>

          {alert.resolvedAt ? (
            <div>
              <CircleCheck size={17} />
              <span>
                <small>Risolto</small>
                <strong>{formatDateTime(alert.resolvedAt)}</strong>
              </span>
            </div>
          ) : null}
        </div>

        {alert.recommendedAction ? (
          <div className="alert-detail__action">
            <span>Cosa fare</span>
            <p>{alert.recommendedAction}</p>
          </div>
        ) : null}

        {alert.resolutionMessage ? (
          <div className="alert-detail__resolution">
            <CircleCheck size={18} />
            <div>
              <strong>Risoluzione</strong>
              <span>{alert.resolutionMessage}</span>
            </div>
          </div>
        ) : null}

        <p className="alert-detail__privacy-note">
          Il portale mostra solo informazioni utili al cliente. I dettagli tecnici di diagnostica restano
          disponibili esclusivamente al personale autorizzato.
        </p>

        <button className="button button--secondary button--full" type="button" onClick={onClose}>
          Chiudi
        </button>
      </section>
    </div>
  );
}
