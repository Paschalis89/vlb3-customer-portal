import { Filter, RefreshCw, RotateCcw, Search, Waves } from 'lucide-react';
import { useMemo, useState } from 'react';
import { HistorySkeleton } from '../components/history/HistorySkeleton';
import { HistoryTimeline } from '../components/history/HistoryTimeline';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { PageHeader } from '../components/ui/PageHeader';
import { appConfig } from '../config/app';
import { useHistory } from '../hooks/useHistory';
import { formatTime } from '../lib/date';
import { historyCategoryLabel } from '../lib/history';
import type { CustomerHistoryFilter } from '../types/history';

const categoryFilters: Array<{ value: CustomerHistoryFilter; label: string }> = [
  { value: 'ALL', label: 'Tutti' },
  { value: 'PUMP', label: 'Pompe' },
  { value: 'FREQUENCY', label: 'Frequenza' },
  { value: 'ALERT', label: 'Allarmi' },
  { value: 'CONNECTIVITY', label: 'Connessione' },
];

export function HistoryPage() {
  const { data, error, isLoading, isRefreshing, refresh } = useHistory();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CustomerHistoryFilter>('ALL');
  const [siteId, setSiteId] = useState('ALL');

  const siteOptions = useMemo(() => {
    if (!data) {
      return [];
    }

    const sites = new Map<string, string>();
    data.events.forEach((event) => sites.set(event.siteId, event.siteName));

    return Array.from(sites.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'it'));
  }, [data]);

  const visibleEvents = useMemo(() => {
    if (!data) {
      return [];
    }

    const normalizedSearch = search.trim().toLocaleLowerCase('it');

    return data.events.filter((event) => {
      if (category !== 'ALL' && event.category !== category) {
        return false;
      }

      if (siteId !== 'ALL' && event.siteId !== siteId) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        event.title,
        event.description,
        event.siteName,
        event.deviceName ?? '',
        event.actor?.name ?? '',
      ]
        .join(' ')
        .toLocaleLowerCase('it');

      return haystack.includes(normalizedSearch);
    });
  }, [category, data, search, siteId]);

  const filtersActive = search.trim() !== '' || category !== 'ALL' || siteId !== 'ALL';

  const resetFilters = () => {
    setSearch('');
    setCategory('ALL');
    setSiteId('ALL');
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Attività"
        title="Storico"
        description="Consulta le operazioni eseguite sulle pompe e gli eventi principali degli impianti."
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
              I comandi completati durante la demo vengono aggiunti allo storico e restano visibili anche dopo un refresh del browser.
            </span>
          </div>
        </div>
      ) : null}

      {isLoading ? <HistorySkeleton /> : null}

      {!isLoading && error && !data ? (
        <ErrorState message={error} onRetry={() => void refresh()} />
      ) : null}

      {!isLoading && data ? (
        <section className="history-panel">
          {error ? (
            <ErrorState
              title="Aggiornamento non riuscito"
              message="Stai visualizzando l'ultimo storico caricato correttamente."
              onRetry={() => void refresh()}
            />
          ) : null}

          <div className="history-panel__heading">
            <div>
              <span className="section-heading__eyebrow">Timeline cliente</span>
              <h2>Attività impianti</h2>
              <p>
                Dati aggiornati alle {formatTime(data.generatedAt)} · {visibleEvents.length}{' '}
                {visibleEvents.length === 1 ? 'evento visualizzato' : 'eventi visualizzati'}
              </p>
            </div>
          </div>

          <div className="history-toolbar">
            <label className="history-search">
              <Search size={18} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cerca impianto, evento o utente"
                aria-label="Cerca nello storico"
              />
            </label>

            <label className="history-site-filter">
              <Filter size={17} />
              <select
                value={siteId}
                onChange={(event) => setSiteId(event.target.value)}
                aria-label="Filtra per impianto"
              >
                <option value="ALL">Tutti gli impianti</option>
                {siteOptions.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="history-filter-row">
            <div className="history-filter-tabs" aria-label="Filtra per tipo di evento">
              {categoryFilters.map((item) => (
                <button
                  className={`history-filter-tab${category === item.value ? ' history-filter-tab--active' : ''}`}
                  key={item.value}
                  type="button"
                  onClick={() => setCategory(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {filtersActive ? (
              <button className="history-reset" type="button" onClick={resetFilters}>
                <RotateCcw size={15} />
                Azzera filtri
              </button>
            ) : null}
          </div>

          {category !== 'ALL' ? (
            <p className="history-filter-description">
              Stai visualizzando solo gli eventi: <strong>{historyCategoryLabel(category)}</strong>.
            </p>
          ) : null}

          {visibleEvents.length === 0 ? (
            <EmptyState
              title="Nessun evento trovato"
              message={
                filtersActive
                  ? 'Prova a modificare la ricerca o ad azzerare i filtri.'
                  : 'Non sono ancora presenti attività da mostrare.'
              }
            />
          ) : (
            <HistoryTimeline events={visibleEvents} />
          )}
        </section>
      ) : null}
    </div>
  );
}
