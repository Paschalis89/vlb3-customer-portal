import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleStop,
  Gauge,
  MapPin,
  Power,
  Radio,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../lib/date';
import type { PumpState } from '../../types/device';
import type { CustomerSiteSummary } from '../../types/site';
import { StatusBadge, type StatusTone } from '../ui/StatusBadge';

interface SiteCardProps {
  site: CustomerSiteSummary;
}

interface PumpDisplay {
  label: string;
  className: string;
  icon: LucideIcon;
}

function getPumpDisplay(state: PumpState): PumpDisplay {
  switch (state) {
    case 'RUNNING':
      return {
        label: 'IN FUNZIONE',
        className: 'customer-site-card__pump--running',
        icon: Power,
      };
    case 'STOPPED':
      return {
        label: 'FERMA',
        className: 'customer-site-card__pump--stopped',
        icon: CircleStop,
      };
    case 'FAULT':
      return {
        label: 'IN ALLARME',
        className: 'customer-site-card__pump--fault',
        icon: AlertTriangle,
      };
    case 'UNKNOWN':
      return {
        label: 'NON DISPONIBILE',
        className: 'customer-site-card__pump--unknown',
        icon: Radio,
      };
  }
}

function getConnectivityTone(site: CustomerSiteSummary): StatusTone {
  return site.connectivity === 'ONLINE' ? 'success' : 'neutral';
}

function getFrequencyLabel(site: CustomerSiteSummary): string {
  const frequency = site.primaryDevice?.frequencyHz;

  if (site.connectivity === 'OFFLINE' || frequency === null || frequency === undefined) {
    return '--';
  }

  return `${frequency.toFixed(2)} Hz`;
}

export function SiteCard({ site }: SiteCardProps) {
  const pump = getPumpDisplay(site.primaryDevice?.pumpState ?? 'UNKNOWN');
  const PumpIcon = pump.icon;
  const isOffline = site.connectivity === 'OFFLINE';

  return (
    <article className={`customer-site-card${isOffline ? ' customer-site-card--offline' : ''}`}>
      <div className="customer-site-card__header">
        <div className="customer-site-card__identity">
          <span className="customer-site-card__eyebrow">Impianto</span>
          <h3>{site.name}</h3>
          <div className="customer-site-card__location">
            <MapPin size={14} />
            <span>{site.locationLabel}</span>
          </div>
        </div>
        <StatusBadge
          label={site.connectivity === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}
          tone={getConnectivityTone(site)}
        />
      </div>

      <p className="customer-site-card__description">{site.description}</p>

      {isOffline ? (
        <div className="customer-site-card__offline-message">
          <Radio size={18} />
          <div>
            <strong>Impianto non collegato</strong>
            <span>Ultimo collegamento {formatRelativeTime(site.lastSeenAt)}</span>
          </div>
        </div>
      ) : (
        <div className="customer-site-card__metrics">
          <div>
            <span>Stato pompa</span>
            <strong className={pump.className}>
              <PumpIcon size={16} />
              {pump.label}
            </strong>
          </div>
          <div>
            <span>Frequenza</span>
            <strong>
              <Gauge size={16} />
              {getFrequencyLabel(site)}
            </strong>
          </div>
        </div>
      )}

      <div className="customer-site-card__status-row">
        {site.activeAlertCount > 0 ? (
          <div className="customer-site-card__alarm customer-site-card__alarm--active">
            <AlertTriangle size={16} />
            <span>
              {site.activeAlertCount} {site.activeAlertCount === 1 ? 'allarme attivo' : 'allarmi attivi'}
            </span>
          </div>
        ) : (
          <div className="customer-site-card__alarm">
            <CheckCircle2 size={16} />
            <span>Nessun allarme</span>
          </div>
        )}

        <span className="customer-site-card__device-count">
          {site.deviceCount} {site.deviceCount === 1 ? 'dispositivo' : 'dispositivi'}
        </span>
      </div>

      <Link className="customer-site-card__open" to={`/sites/${site.id}`}>
        <span>Apri impianto</span>
        <ArrowRight size={17} />
      </Link>
    </article>
  );
}
