import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Building2,
  MapPin,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { DeviceCard } from '../components/devices/DeviceCard';
import { ErrorState } from '../components/ui/ErrorState';
import { PageHeader } from '../components/ui/PageHeader';
import { Skeleton } from '../components/ui/Skeleton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useSite } from '../hooks/useSite';
import { formatRelativeTime } from '../lib/date';

function SiteDetailLoading() {
  return (
    <div className="site-detail-loading" aria-label="Caricamento dettaglio impianto">
      <div className="site-overview-card">
        <Skeleton className="skeleton--site-detail-title" />
        <Skeleton className="skeleton--site-detail-line" />
        <div className="site-overview-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="skeleton--overview-box" key={index} />
          ))}
        </div>
      </div>
      <Skeleton className="skeleton--device-card" />
    </div>
  );
}

export function SiteDetailPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const { site, error, isLoading, isRefreshing, refresh } = useSite(siteId);

  return (
    <div className="page-stack">
      <Link className="back-link" to="/sites">
        <ArrowLeft size={17} />
        Tutti gli impianti
      </Link>

      {isLoading ? <SiteDetailLoading /> : null}

      {!isLoading && error ? (
        <ErrorState title="Impianto non disponibile" message={error} onRetry={() => void refresh()} />
      ) : null}

      {!isLoading && !error && site ? (
        <>
          <PageHeader
            eyebrow="Dettaglio impianto"
            title={site.name}
            description={site.description}
            actions={
              <button
                className="button button--secondary"
                type="button"
                onClick={() => void refresh()}
                disabled={isRefreshing}
              >
                <RefreshCw className={isRefreshing ? 'spin' : undefined} size={17} />
                {isRefreshing ? 'Aggiornamento...' : 'Aggiorna'}
              </button>
            }
          />

          <section className={`site-overview-card${site.connectivity === 'OFFLINE' ? ' site-overview-card--offline' : ''}`}>
            <div className="site-overview-card__header">
              <div>
                <span className="site-overview-card__eyebrow">Stato generale</span>
                <h2>{site.connectivity === 'ONLINE' ? 'Impianto collegato' : 'Impianto offline'}</h2>
              </div>
              <StatusBadge
                label={site.connectivity === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}
                tone={site.connectivity === 'ONLINE' ? 'success' : 'neutral'}
              />
            </div>

            {site.connectivity === 'OFFLINE' ? (
              <div className="site-overview-card__notice">
                <Radio size={18} />
                <span>
                  I controlli remoti torneranno disponibili quando l'impianto sarà nuovamente collegato.
                </span>
              </div>
            ) : null}

            <div className="site-overview-grid">
              <div className="site-overview-metric">
                <MapPin size={18} />
                <span>Area</span>
                <strong>{site.locationLabel}</strong>
              </div>
              <div className="site-overview-metric">
                <Building2 size={18} />
                <span>Dispositivi</span>
                <strong>{site.deviceCount}</strong>
              </div>
              <div className="site-overview-metric">
                <Activity size={18} />
                <span>Pompe attive</span>
                <strong>{site.activePumpCount}</strong>
              </div>
              <div className={`site-overview-metric${site.activeAlertCount > 0 ? ' site-overview-metric--danger' : ''}`}>
                <AlertTriangle size={18} />
                <span>Allarmi attivi</span>
                <strong>{site.activeAlertCount}</strong>
              </div>
            </div>

            <div className="site-overview-card__last-seen">
              <span>Ultimo aggiornamento impianto</span>
              <strong>{formatRelativeTime(site.lastSeenAt)}</strong>
            </div>
          </section>

          <section className="section-stack">
            <div className="section-heading">
              <div>
                <p className="section-heading__eyebrow">Dispositivi</p>
                <h2>Pompe dell'impianto</h2>
              </div>
              <span className="section-heading__count">
                {site.devices.length} {site.devices.length === 1 ? 'dispositivo' : 'dispositivi'}
              </span>
            </div>

            <div className="devices-grid">
              {site.devices.map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
