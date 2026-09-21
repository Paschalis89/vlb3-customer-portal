import { AlertTriangle, Bell, RefreshCw, ShieldCheck, Waves } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AlertCard } from '../components/alerts/AlertCard';
import { AlertDetailDialog } from '../components/alerts/AlertDetailDialog';
import { AlertsEmptyState } from '../components/alerts/AlertsEmptyState';
import { AlertsSkeleton } from '../components/alerts/AlertsSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { PageHeader } from '../components/ui/PageHeader';
import { appConfig } from '../config/app';
import { useAlerts } from '../hooks/useAlerts';
import { formatTime } from '../lib/date';
import type { AlertFilter, CustomerAlert } from '../types/alert';

type AlertView = 'ACTIVE' | 'HISTORY';

const filters: Array<{ value: AlertFilter; label: string }> = [
  { value: 'ALL', label: 'Tutti' },
  { value: 'CRITICAL', label: 'Critici' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'RESOLVED', label: 'Risolti' },
];

export function AlertsPage() {
  const { data, error, isLoading, isRefreshing, refresh } = useAlerts();
  const [view, setView] = useState<AlertView>('ACTIVE');
  const [filter, setFilter] = useState<AlertFilter>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<CustomerAlert | null>(null);

  const activeCriticalCount =
    data?.active.filter((alert) => alert.severity === 'CRITICAL').length ?? 0;
  const activeWarningCount =
    data?.active.filter((alert) => alert.severity === 'WARNING').length ?? 0;
  const resolvedCount = data?.history.length ?? 0;

  const visibleAlerts = useMemo(() => {
    if (!data) {
      return [];
    }

    const source = view === 'ACTIVE' ? data.active : data.history;

    if (filter === 'ALL') {
      return source;
    }

    if (filter === 'RESOLVED') {
      return source.filter((alert) => alert.status === 'RESOLVED');
    }

    return source.filter((alert) => alert.severity === filter);
  }, [data, filter, view]);

  const handleViewChange = (nextView: AlertView) => {
    setView(nextView);

    if (nextView === 'ACTIVE' && filter === 'RESOLVED') {
      setFilter('ALL');
    }
  };

  const handleFilterChange = (nextFilter: AlertFilter) => {
    setFilter(nextFilter);

    if (nextFilter === 'RESOLVED') {
      setView('HISTORY');
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Monitoraggio"
        title="Allarmi"
        description="Controlla gli eventi che richiedono attenzione e consulta lo storico degli allarmi risolti."
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
            <span>
              Lo scenario demo non ha allarmi attivi. Lo storico contiene eventi risolti per mostrare il
              flusso completo.
            </span>
          </div>
        </div>
      ) : null}

      {isLoading ? <AlertsSkeleton /> : null}

      {!isLoading && error && !data ? (
        <ErrorState message={error} onRetry={() => void refresh()} />
      ) : null}

      {!isLoading && data ? (
        <>
          {error ? (
            <ErrorState
              title="Aggiornamento non riuscito"
              message="Stai visualizzando gli ultimi allarmi caricati correttamente."
              onRetry={() => void refresh()}
            />
          ) : null}

          <section className="alerts-summary-grid" aria-label="Riepilogo allarmi">
            <article className="alert-summary-card alert-summary-card--danger">
              <div className="alert-summary-card__icon" aria-hidden="true">
                <AlertTriangle size={20} />
              </div>
              <span>Critici attivi</span>
              <strong>{activeCriticalCount}</strong>
              <small>Richiedono attenzione immediata</small>
            </article>

            <article className="alert-summary-card alert-summary-card--warning">
              <div className="alert-summary-card__icon" aria-hidden="true">
                <Bell size={20} />
              </div>
              <span>Warning attivi</span>
              <strong>{activeWarningCount}</strong>
              <small>Da monitorare</small>
            </article>

            <article className="alert-summary-card alert-summary-card--success">
              <div className="alert-summary-card__icon" aria-hidden="true">
                <ShieldCheck size={20} />
              </div>
              <span>Risolti</span>
              <strong>{resolvedCount}</strong>
              <small>Disponibili nello storico</small>
            </article>
          </section>

          <section className="alerts-panel">
            <div className="alerts-panel__heading">
              <div>
                <span className="section-heading__eyebrow">Eventi impianto</span>
                <h2>{view === 'ACTIVE' ? 'Allarmi attivi' : 'Storico allarmi'}</h2>
                <p>
                  Dati aggiornati alle {formatTime(data.generatedAt)} · {visibleAlerts.length}{' '}
                  {visibleAlerts.length === 1 ? 'evento visualizzato' : 'eventi visualizzati'}
                </p>
              </div>
            </div>

            <div className="alerts-toolbar">
              <div className="alerts-view-tabs" role="tablist" aria-label="Sezione allarmi">
                <button
                  aria-selected={view === 'ACTIVE'}
                  className={`alerts-view-tab${view === 'ACTIVE' ? ' alerts-view-tab--active' : ''}`}
                  role="tab"
                  type="button"
                  onClick={() => handleViewChange('ACTIVE')}
                >
                  Attivi
                  <span>{data.active.length}</span>
                </button>
                <button
                  aria-selected={view === 'HISTORY'}
                  className={`alerts-view-tab${view === 'HISTORY' ? ' alerts-view-tab--active' : ''}`}
                  role="tab"
                  type="button"
                  onClick={() => handleViewChange('HISTORY')}
                >
                  Storico
                  <span>{data.history.length}</span>
                </button>
              </div>

              <div className="alerts-filter-tabs" aria-label="Filtra allarmi">
                {filters.map((item) => (
                  <button
                    className={`alerts-filter-tab${filter === item.value ? ' alerts-filter-tab--active' : ''}`}
                    key={item.value}
                    type="button"
                    onClick={() => handleFilterChange(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {visibleAlerts.length === 0 ? (
              <AlertsEmptyState activeView={view === 'ACTIVE'} filtered={filter !== 'ALL'} />
            ) : (
              <div className="alerts-grid">
                {visibleAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onOpen={setSelectedAlert} />
                ))}
              </div>
            )}

          </section>
        </>
      ) : null}

      <AlertDetailDialog alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
    </div>
  );
}
