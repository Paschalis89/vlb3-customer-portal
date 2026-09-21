import { useCallback, useEffect, useState } from 'react';
import { getAlerts } from '../api/alerts';
import type { CustomerAlertsResponse } from '../types/alert';

interface UseAlertsResult {
  data: CustomerAlertsResponse | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Non e stato possibile caricare gli allarmi.';
}

export function useAlerts(): UseAlertsResult {
  const [data, setData] = useState<CustomerAlertsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async (background = false) => {
    if (background) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      setData(await getAlerts());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      if (background) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load(data !== null);
  }, [data, load]);

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    refresh,
  };
}
