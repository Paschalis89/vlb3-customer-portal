import { useCallback, useEffect, useState } from 'react';
import { getDashboard } from '../api/dashboard';
import type { DashboardData } from '../types/dashboard';

interface UseDashboardResult {
  data: DashboardData | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Non e stato possibile caricare la dashboard.';
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
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
      const dashboard = await getDashboard();
      setData(dashboard);
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
