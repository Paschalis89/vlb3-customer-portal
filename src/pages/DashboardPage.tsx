import {
  Activity,
  Bell,
  Building2,
  Radio,
  RefreshCw,
  Waves,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardKpiCard } from '../components/dashboard/DashboardKpiCard';
import { SiteCard } from '../components/sites/SiteCard';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { PageHeader } from '../components/ui/PageHeader';
import { Skeleton } from '../components/ui/Skeleton';
import { appConfig } from '../config/app';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { formatTime } from '../lib/date';

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Buongiorno';
  }

  if (hour < 18) {
    return 'Buon pomeriggio';
  }

  return 'Buonasera';
}

function DashboardSkeleton() {
  return (
    <div className="dashboard-loading" aria-label="Caricamento dashboard" aria-busy="true">
      <section className="kpi-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <article className="kpi-card" key={index}>
            <Skeleton className="skeleton--icon" />
            <Skeleton className="skeleton--label" />
            <Skeleton className="skeleton--value" />
          </article>
        ))}
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <div>
            <Skeleton className="skeleton--eyebrow" />
            <Skeleton className="skeleton--heading" />
          </div>
        </div>

        <div className="dashboard-site-grid">
          {Array.from({ length: 3 }, (_, index) => (
            <article className="customer-site-card" key={index}>
              <Skeleton className="skeleton--site-title" />
              <Skeleton className="skeleton--site-line" />
              <Skeleton className="skeleton--site-block" />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data, error, isLoading, isRefreshing, refresh } = useDashboard();

  const organizationName = data?.organizationName ?? user?.organizationName ?? 'Organizzazione';

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={organizationName}
        title={`${getGreeting()}, ${user?.firstName ?? 'utente'}`}
        description="Controlla rapidamente lo stato dei tuoi impianti e delle pompe."
        actions={
          data ? (
            <button
              className="button button--secondary button--compact"
              type="button"
              onClick={() => void refresh()}
              disabled={isRefreshing}
            >
              <RefreshCw className={isRefreshing ? 'spin' : undefined} size={17} />
              Aggiorna
            </button>
          ) : null
        }
      />

      {appConfig.demoMode ? (
        <div className="demo-banner">
          <Waves size={18} />
          <div>
            <strong>Demo mode attivo</strong>
            <span>I dati sono simulati ma attraversano lo stesso data layer previsto per le API reali.</span>
          </div>
        </div>
      ) : null}

      {isLoading ? <DashboardSkeleton /> : null}

      {!isLoading && error && !data ? (
        <ErrorState message={error} onRetry={() => void refresh()} />
      ) : null}

      {!isLoading && data ? (
        <>
          {error ? (
            <ErrorState
              title="Aggiornamento non riuscito"
              message="Stai visualizzando gli ultimi dati caricati correttamente."
              onRetry={() => void refresh()}
            />
          ) : null}

          <section className="kpi-grid" aria-label="Riepilogo impianti">
            <DashboardKpiCard
              label="Impianti"
              value={data.metrics.siteCount}
              icon={Building2}
              helperText="Totale associati"
            />
            <DashboardKpiCard
              label="Online"
              value={data.metrics.onlineSiteCount}
              icon={Radio}
              tone="success"
              helperText={`${data.metrics.siteCount - data.metrics.onlineSiteCount} offline`}
            />
            <DashboardKpiCard
              label="Pompe attive"
              value={data.metrics.activePumpCount}
              icon={Activity}
              tone="success"
              helperText="In funzione ora"
            />
            <DashboardKpiCard
              label="Allarmi"
              value={data.metrics.activeAlertCount}
              icon={Bell}
              tone={data.metrics.activeAlertCount > 0 ? 'danger' : 'success'}
              helperText={data.metrics.activeAlertCount > 0 ? 'Richiedono attenzione' : 'Nessun allarme attivo'}
            />
          </section>

          <section className="section-stack">
            <div className="section-heading">
              <div>
                <span className="section-heading__eyebrow">Panoramica</span>
                <h2>I tuoi impianti</h2>
                <p className="section-heading__description">
                  Stato aggiornato alle {formatTime(data.generatedAt)}
                </p>
              </div>
              <Link className="section-heading__link" to="/sites">
                Vedi tutti
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {data.sites.length === 0 ? (
              <EmptyState
                title="Nessun impianto disponibile"
                message="Quando un impianto verra associato alla tua azienda comparira qui."
              />
            ) : (
              <div className="dashboard-site-grid">
                {data.sites.map((site) => (
                  <SiteCard key={site.id} site={site} />
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
