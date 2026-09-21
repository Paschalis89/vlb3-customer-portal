import { Activity, Clock3, Gauge, RefreshCw } from 'lucide-react';
import { FrequencyChart } from '../charts/FrequencyChart';
import { PumpStateChart } from '../charts/PumpStateChart';
import { ErrorState } from '../ui/ErrorState';
import { Skeleton } from '../ui/Skeleton';
import {
  getTelemetryStats,
  TELEMETRY_RANGE_OPTIONS,
} from '../../lib/telemetry';
import { formatRelativeTime } from '../../lib/date';
import type { DeviceTelemetrySeries, TelemetryRange } from '../../types/telemetry';

interface TelemetryHistoryProps {
  telemetry: DeviceTelemetrySeries | null;
  range: TelemetryRange;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isOffline: boolean;
  onRangeChange: (range: TelemetryRange) => void;
  onRefresh: () => void;
}

function formatFrequency(value: number | null): string {
  return value === null ? '--' : `${value.toFixed(2)} Hz`;
}

export function TelemetryHistory({
  telemetry,
  range,
  error,
  isLoading,
  isRefreshing,
  isOffline,
  onRangeChange,
  onRefresh,
}: TelemetryHistoryProps) {
  if (isLoading) {
    return (
      <section className="telemetry-history-card">
        <Skeleton className="skeleton--telemetry-history-heading" />
        <Skeleton className="skeleton--telemetry-history-chart" />
        <Skeleton className="skeleton--telemetry-history-chart skeleton--telemetry-history-chart-small" />
      </section>
    );
  }

  if (error || !telemetry) {
    return (
      <section className="telemetry-history-card">
        <ErrorState
          message={error ?? 'Andamento non disponibile.'}
          onRetry={onRefresh}
          title="Impossibile caricare l'andamento"
        />
      </section>
    );
  }

  const stats = getTelemetryStats(telemetry.points);

  return (
    <section className="telemetry-history-card">
      <div className="telemetry-history__header">
        <div>
          <p className="section-heading__eyebrow">Andamento</p>
          <h2>Storico operativo</h2>
          <p className="section-heading__description">
            Frequenza e stato pompa nel periodo selezionato.
          </p>
        </div>

        <button
          className="button button--secondary button--compact"
          disabled={isRefreshing}
          onClick={onRefresh}
          type="button"
        >
          <RefreshCw className={isRefreshing ? 'spin' : undefined} size={16} />
          Aggiorna
        </button>
      </div>

      <div className="telemetry-range-tabs" role="group" aria-label="Periodo telemetria">
        {TELEMETRY_RANGE_OPTIONS.map((option) => (
          <button
            aria-pressed={range === option.value}
            className={`telemetry-range-tab${range === option.value ? ' telemetry-range-tab--active' : ''}`}
            key={option.value}
            onClick={() => onRangeChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      {isOffline ? (
        <div className="telemetry-offline-note">
          <Clock3 size={17} />
          <span>
            Il dispositivo è offline: il grafico mostra solo i campioni ricevuti prima
            dell'ultimo collegamento. I dati mancanti non vengono riempiti artificialmente.
          </span>
        </div>
      ) : null}

      <div className="telemetry-stats-grid">
        <div>
          <Gauge size={18} />
          <span>Ultima frequenza</span>
          <strong>{formatFrequency(stats.latestPoint?.frequencyHz ?? null)}</strong>
        </div>
        <div>
          <Activity size={18} />
          <span>Media in marcia</span>
          <strong>{formatFrequency(stats.averageRunningFrequencyHz)}</strong>
        </div>
        <div>
          <Gauge size={18} />
          <span>Picco nel periodo</span>
          <strong>{formatFrequency(stats.maxFrequencyHz)}</strong>
        </div>
        <div>
          <Clock3 size={18} />
          <span>Ultimo campione</span>
          <strong>
            {stats.latestPoint ? formatRelativeTime(stats.latestPoint.timestamp) : '--'}
          </strong>
        </div>
      </div>

      <div className="telemetry-chart-card">
        <div className="telemetry-chart-card__heading">
          <div>
            <span>Frequenza</span>
            <strong>Hz nel tempo</strong>
          </div>
          <span className="telemetry-chart-card__legend">
            <i aria-hidden="true" /> Frequenza
          </span>
        </div>
        <FrequencyChart points={telemetry.points} range={range} />
      </div>

      <div className="telemetry-chart-card">
        <div className="telemetry-chart-card__heading">
          <div>
            <span>Stato pompa</span>
            <strong>Marcia / arresto</strong>
          </div>
          <span className="telemetry-chart-card__legend">
            <i aria-hidden="true" /> Stato
          </span>
        </div>
        <PumpStateChart points={telemetry.points} range={range} />
      </div>

      <p className="telemetry-history__footnote">
        La telemetria cliente mostra solo grandezze già verificate. Corrente, tensione,
        temperatura, DC Bus e coppia resteranno nascoste finché le relative scale VLB3 non
        saranno validate.
      </p>
    </section>
  );
}
