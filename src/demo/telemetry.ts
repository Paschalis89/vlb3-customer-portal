import { getDemoDevice } from './deviceStore';
import type { PumpState } from '../types/device';
import type {
  DeviceTelemetrySeries,
  TelemetryPoint,
  TelemetryRange,
} from '../types/telemetry';

const DEMO_LATENCY_MS = 260;

interface RangeConfig {
  durationMs: number;
  pointCount: number;
}

const RANGE_CONFIG: Record<TelemetryRange, RangeConfig> = {
  '1h': { durationMs: 60 * 60_000, pointCount: 31 },
  '24h': { durationMs: 24 * 60 * 60_000, pointCount: 49 },
  '7d': { durationMs: 7 * 24 * 60 * 60_000, pointCount: 43 },
  '30d': { durationMs: 30 * 24 * 60 * 60_000, pointCount: 61 },
};

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function historicalPumpState(deviceId: string, index: number): PumpState {
  if (deviceId === 'device-pozzonord-main') {
    const phase = index % 12;
    return phase >= 2 && phase <= 9 ? 'RUNNING' : 'STOPPED';
  }

  if (deviceId === 'device-camposud-main') {
    const phase = index % 14;
    return phase >= 4 && phase <= 8 ? 'RUNNING' : 'STOPPED';
  }

  const phase = index % 10;
  return phase >= 3 && phase <= 7 ? 'RUNNING' : 'STOPPED';
}

function frequencyForState(
  pumpState: PumpState,
  setpointHz: number | null,
  index: number,
): number | null {
  if (pumpState === 'UNKNOWN' || pumpState === 'FAULT') {
    return null;
  }

  if (pumpState === 'STOPPED') {
    return 0;
  }

  const base = setpointHz ?? 40;
  const variation = Math.sin(index * 0.82) * 0.28 + Math.cos(index * 0.31) * 0.11;
  return Number(Math.max(30, Math.min(50, base + variation)).toFixed(2));
}

function createPoint(
  deviceId: string,
  timestamp: number,
  index: number,
  setpointHz: number | null,
): TelemetryPoint {
  const pumpState = historicalPumpState(deviceId, index);

  return {
    timestamp: new Date(timestamp).toISOString(),
    pumpState,
    frequencyHz: frequencyForState(pumpState, setpointHz, index),
  };
}

export async function loadDemoDeviceTelemetry(
  deviceId: string,
  range: TelemetryRange,
): Promise<DeviceTelemetrySeries> {
  await delay(DEMO_LATENCY_MS);

  const device = getDemoDevice(deviceId);
  if (!device) {
    throw new Error('Dispositivo non trovato.');
  }

  const config = RANGE_CONFIG[range];
  const now = Date.now();
  const from = now - config.durationMs;
  const step = config.durationMs / (config.pointCount - 1);
  const offlineSince =
    device.connectivity === 'OFFLINE' ? new Date(device.lastSeenAt).getTime() : null;

  const points = Array.from({ length: config.pointCount }, (_, index) => {
    const timestamp = from + step * index;

    if (offlineSince !== null && timestamp > offlineSince) {
      return {
        timestamp: new Date(timestamp).toISOString(),
        pumpState: 'UNKNOWN' as const,
        frequencyHz: null,
      };
    }

    return createPoint(device.id, timestamp, index, device.setpointHz);
  });

  if (device.connectivity === 'ONLINE') {
    points[points.length - 1] = {
      timestamp: new Date(now).toISOString(),
      pumpState: device.pumpState,
      frequencyHz: device.frequencyHz,
    };
  } else {
    const lastAvailableIndex = [...points]
      .map((point, index) => ({ point, index }))
      .reverse()
      .find(({ point }) => point.pumpState !== 'UNKNOWN')?.index;

    if (lastAvailableIndex !== undefined) {
      points[lastAvailableIndex] = {
        timestamp: device.lastSeenAt,
        pumpState: 'STOPPED',
        frequencyHz: 0,
      };
    }
  }

  return {
    deviceId,
    range,
    from: new Date(from).toISOString(),
    to: new Date(now).toISOString(),
    generatedAt: new Date(now).toISOString(),
    points,
  };
}
