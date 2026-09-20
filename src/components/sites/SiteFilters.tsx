import { Filter, RotateCcw, Search } from 'lucide-react';

export type ConnectivityFilter = 'ALL' | 'ONLINE' | 'OFFLINE';
export type PumpFilter = 'ALL' | 'RUNNING' | 'STOPPED';
export type AlertFilter = 'ALL' | 'WITH_ALERTS';

interface SiteFiltersProps {
  search: string;
  connectivity: ConnectivityFilter;
  pump: PumpFilter;
  alerts: AlertFilter;
  resultCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onConnectivityChange: (value: ConnectivityFilter) => void;
  onPumpChange: (value: PumpFilter) => void;
  onAlertChange: (value: AlertFilter) => void;
  onReset: () => void;
}

export function SiteFilters({
  search,
  connectivity,
  pump,
  alerts,
  resultCount,
  totalCount,
  onSearchChange,
  onConnectivityChange,
  onPumpChange,
  onAlertChange,
  onReset,
}: SiteFiltersProps) {
  const hasFilters =
    search.trim().length > 0 || connectivity !== 'ALL' || pump !== 'ALL' || alerts !== 'ALL';

  return (
    <section className="site-filters" aria-label="Filtri impianti">
      <div className="site-filters__search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={search}
          placeholder="Cerca impianto, area o descrizione..."
          aria-label="Cerca impianto"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="site-filters__controls">
        <label className="site-filter-field">
          <span>
            <Filter size={14} />
            Collegamento
          </span>
          <select
            value={connectivity}
            onChange={(event) => onConnectivityChange(event.target.value as ConnectivityFilter)}
          >
            <option value="ALL">Tutti</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </label>

        <label className="site-filter-field">
          <span>Pompa</span>
          <select value={pump} onChange={(event) => onPumpChange(event.target.value as PumpFilter)}>
            <option value="ALL">Tutte</option>
            <option value="RUNNING">Attiva</option>
            <option value="STOPPED">Ferma</option>
          </select>
        </label>

        <label className="site-filter-field">
          <span>Allarmi</span>
          <select
            value={alerts}
            onChange={(event) => onAlertChange(event.target.value as AlertFilter)}
          >
            <option value="ALL">Tutti</option>
            <option value="WITH_ALERTS">Con allarme</option>
          </select>
        </label>

        <button
          className="button button--secondary button--compact site-filters__reset"
          type="button"
          onClick={onReset}
          disabled={!hasFilters}
        >
          <RotateCcw size={16} />
          Azzera
        </button>
      </div>

      <div className="site-filters__summary" aria-live="polite">
        <strong>{resultCount}</strong>
        <span>{resultCount === 1 ? 'impianto trovato' : 'impianti trovati'}</span>
        {resultCount !== totalCount ? <span>su {totalCount}</span> : null}
      </div>
    </section>
  );
}
