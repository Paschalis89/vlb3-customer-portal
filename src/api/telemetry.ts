import { appConfig } from '../config/app';
import { loadDemoDeviceTelemetry } from '../demo/telemetry';
import type { DeviceTelemetrySeries, TelemetryRange } from '../types/telemetry';
import { apiRequest } from './client';

export async function getDeviceTelemetry(
  deviceId: string,
  range: TelemetryRange,
): Promise<DeviceTelemetrySeries> {
  if (appConfig.demoMode) {
    return loadDemoDeviceTelemetry(deviceId, range);
  }

  const query = new URLSearchParams({ range });

  return apiRequest<DeviceTelemetrySeries>(
    `/customer/devices/${encodeURIComponent(deviceId)}/telemetry?${query.toString()}`,
  );
}
