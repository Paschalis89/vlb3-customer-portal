import { useCallback, useEffect, useState } from 'react';
import { getHistory } from '../api/history';
import type { CustomerHistoryResponse } from '../types/history';

interface UseHistoryResult {
  data: CustomerHistoryResponse | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Non è stato possibile caricare lo storico.';
}

export function useHistory(): UseHistoryResult {
  const [data, setData] = useState<CustomerHistoryResponse | null>(null);
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
      setData(await getHistory());
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
