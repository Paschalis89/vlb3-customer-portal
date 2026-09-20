import { useCallback, useEffect, useState } from 'react';
import { getSites } from '../api/sites';
import type { CustomerSiteSummary } from '../types/site';

interface UseSitesResult {
  sites: CustomerSiteSummary[];
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Non e stato possibile caricare gli impianti.';
}

export function useSites(): UseSitesResult {
  const [sites, setSites] = useState<CustomerSiteSummary[]>([]);
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
      setSites(await getSites());
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
    await load(sites.length > 0);
  }, [load, sites.length]);

  return {
    sites,
    error,
    isLoading,
    isRefreshing,
    refresh,
  };
}
