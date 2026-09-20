import { useCallback, useEffect, useState } from 'react';
import { getSite } from '../api/sites';
import type { CustomerSiteDetail } from '../types/site';

interface UseSiteResult {
  site: CustomerSiteDetail | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Non è stato possibile caricare il dettaglio dell'impianto.";
}

export function useSite(siteId: string | undefined): UseSiteResult {
  const [site, setSite] = useState<CustomerSiteDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(
    async (background = false) => {
      if (!siteId) {
        setError('Identificativo impianto non disponibile.');
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
        setSite(await getSite(siteId));
      } catch (loadError) {
        setSite(null);
        setError(getErrorMessage(loadError));
      } finally {
        if (background) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [siteId],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load(site !== null);
  }, [load, site]);

  return {
    site,
    error,
    isLoading,
    isRefreshing,
    refresh,
  };
}
