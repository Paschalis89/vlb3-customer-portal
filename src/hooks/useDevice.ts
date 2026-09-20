import { useCallback, useEffect, useState } from 'react';
import { getDevice } from '../api/devices';
import type { CustomerDeviceDetail } from '../types/device';

interface UseDeviceResult {
  device: CustomerDeviceDetail | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Non è stato possibile caricare il dispositivo.';
}

export function useDevice(deviceId: string | undefined): UseDeviceResult {
  const [device, setDevice] = useState<CustomerDeviceDetail | null>(null);
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
        setDevice(await getDevice(deviceId));
      } catch (loadError) {
        setDevice(null);
        setError(getErrorMessage(loadError));
      } finally {
        if (background) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [deviceId],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load(device !== null);
  }, [device, load]);

  return {
    device,
    error,
    isLoading,
    isRefreshing,
    refresh,
  };
}
