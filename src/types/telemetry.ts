import type { PumpState } from './device';

export type TelemetryRange = '1h' | '24h' | '7d' | '30d';

export interface TelemetryPoint {
  timestamp: string;
  frequencyHz: number | null;
  pumpState: PumpState;
}

export interface DeviceTelemetrySeries {
  deviceId: string;
  range: TelemetryRange;
  from: string;
  to: string;
  generatedAt: string;
  points: TelemetryPoint[];
}

export interface TelemetryRangeOption {
  value: TelemetryRange;
  label: string;
}
