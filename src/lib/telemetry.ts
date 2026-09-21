import type { PumpState } from '../types/device';
import type { TelemetryPoint, TelemetryRange } from '../types/telemetry';

export const TELEMETRY_RANGE_OPTIONS = [
  { value: '1h', label: 'Ultima ora' },
  { value: '24h', label: '24 ore' },
  { value: '7d', label: '7 giorni' },
  { value: '30d', label: '30 giorni' },
] as const;

export function formatTelemetryAxisLabel(
  timestamp: string | number,
  range: TelemetryRange,
): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  if (range === '1h' || range === '24h') {
    return new Intl.DateTimeFormat('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

export function formatTelemetryTooltipLabel(timestamp: string | number): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return 'Data non disponibile';
  }

  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function pumpStateToChartValue(state: PumpState): number | null {
  if (state === 'RUNNING') {
    return 1;
  }

  if (state === 'STOPPED') {
    return 0;
  }

  return null;
}

export function pumpStateChartLabel(value: number): string {
  return value >= 0.5 ? 'IN FUNZIONE' : 'FERMA';
}

export function getTelemetryStats(points: TelemetryPoint[]) {
  const validFrequencyPoints = points.filter(
    (point): point is TelemetryPoint & { frequencyHz: number } =>
      point.frequencyHz !== null,
  );
  const runningPoints = validFrequencyPoints.filter((point) => point.frequencyHz > 0);
  const latestPoint = [...points].reverse().find((point) => point.frequencyHz !== null) ?? null;

  const averageRunningFrequencyHz =
    runningPoints.length > 0
      ? runningPoints.reduce((sum, point) => sum + point.frequencyHz, 0) /
        runningPoints.length
      : null;

  const maxFrequencyHz =
    validFrequencyPoints.length > 0
      ? Math.max(...validFrequencyPoints.map((point) => point.frequencyHz))
      : null;

  return {
    latestPoint,
    averageRunningFrequencyHz,
    maxFrequencyHz,
    availableSamples: validFrequencyPoints.length,
    totalSamples: points.length,
  };
}
