import { RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SiteCard } from '../components/sites/SiteCard';
import {
  SiteFilters,
  type AlertFilter,
  type ConnectivityFilter,
  type PumpFilter,
} from '../components/sites/SiteFilters';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { PageHeader } from '../components/ui/PageHeader';
import { Skeleton } from '../components/ui/Skeleton';
import { useSites } from '../hooks/useSites';
import type { CustomerSiteSummary } from '../types/site';

function matchesSearch(site: CustomerSiteSummary, search: string): boolean {
  const normalizedSearch = search.trim().toLocaleLowerCase('it-IT');

  if (!normalizedSearch) {
    return true;
  }

  return [site.name, site.description, site.locationLabel].some((value) =>
    value.toLocaleLowerCase('it-IT').includes(normalizedSearch),
  );
}

function SitesLoading() {
  return (
    <div className="sites-loading" aria-label="Caricamento impianti">
      <div className="site-filters site-filters--loading">
        <Skeleton className="skeleton--filter-search" />
        <Skeleton className="skeleton--filter-controls" />
      </div>
      <div className="sites-grid">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="customer-site-card customer-site-card--skeleton" key={index}>
            <Skeleton className="skeleton--site-title" />
            <Skeleton className="skeleton--site-line" />
            <Skeleton className="skeleton--site-block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SitesPage() {
  const { sites, error, isLoading, isRefreshing, refresh } = useSites();
  const [search, setSearch] = useState('');
  const [connectivity, setConnectivity] = useState<ConnectivityFilter>('ALL');
  const [pump, setPump] = useState<PumpFilter>('ALL');
  const [alerts, setAlerts] = useState<AlertFilter>('ALL');

  const filteredSites = useMemo(
    () =>
      sites.filter((site) => {
        if (!matchesSearch(site, search)) {
          return false;
        }

        if (connectivity !== 'ALL' && site.connectivity !== connectivity) {
          return false;
        }

        if (pump !== 'ALL' && site.primaryDevice?.pumpState !== pump) {
          return false;
        }

        if (alerts === 'WITH_ALERTS' && site.activeAlertCount === 0) {
          return false;
        }

        return true;
      }),
    [alerts, connectivity, pump, search, sites],
  );

  function resetFilters() {
    setSearch('');
    setConnectivity('ALL');
    setPump('ALL');
    setAlerts('ALL');
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Impianti"
        title="I tuoi impianti"
        description="Controlla rapidamente collegamento, stato delle pompe e allarmi dei siti della tua azienda."
        actions={
          <button
            className="button button--secondary"
            type="button"
            onClick={() => void refresh()}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw className={isRefreshing ? 'spin' : undefined} size={17} />
            {isRefreshing ? 'Aggiornamento...' : 'Aggiorna'}
          </button>
        }
      />

      {isLoading ? <SitesLoading /> : null}

      {!isLoading && error ? (
        <ErrorState message={error} onRetry={() => void refresh()} />
      ) : null}

      {!isLoading && !error ? (
        <>
          <SiteFilters
            search={search}
            connectivity={connectivity}
            pump={pump}
            alerts={alerts}
            resultCount={filteredSites.length}
            totalCount={sites.length}
            onSearchChange={setSearch}
            onConnectivityChange={setConnectivity}
            onPumpChange={setPump}
            onAlertChange={setAlerts}
            onReset={resetFilters}
          />

          {sites.length === 0 ? (
            <EmptyState
              title="Nessun impianto disponibile"
              message="Non risultano ancora impianti associati alla tua azienda."
            />
          ) : filteredSites.length === 0 ? (
            <div className="sites-empty-filter">
              <EmptyState
                title="Nessun risultato"
                message="Nessun impianto corrisponde ai filtri selezionati."
              />
              <button className="button button--secondary" type="button" onClick={resetFilters}>
                Azzera filtri
              </button>
            </div>
          ) : (
            <div className="sites-grid">
              {filteredSites.map((site) => (
                <SiteCard key={site.id} site={site} />
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
