import { useCallback, useEffect, useState } from 'react';
import { getDeviceTelemetry } from '../api/telemetry';
import type { DeviceTelemetrySeries, TelemetryRange } from '../types/telemetry';

interface UseDeviceTelemetryResult {
  telemetry: DeviceTelemetrySeries | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Non è stato possibile caricare la telemetria.';
}

export function useDeviceTelemetry(
  deviceId: string | undefined,
  range: TelemetryRange,
): UseDeviceTelemetryResult {
  const [telemetry, setTelemetry] = useState<DeviceTelemetrySeries | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(
    async (background = false) => {
      if (!deviceId) {
        setError('Identificativo dispositivo non disponibile.');
        setIsLoading(false);
        return;
      }

      if (background) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        setTelemetry(await getDeviceTelemetry(deviceId, range));
      } catch (loadError) {
        if (!background) {
          setTelemetry(null);
        }
        setError(getErrorMessage(loadError));
      } finally {
        if (background) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [deviceId, range],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load(telemetry !== null);
  }, [load, telemetry]);

  return {
    telemetry,
    error,
    isLoading,
    isRefreshing,
    refresh,
  };
}
