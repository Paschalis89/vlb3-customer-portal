import { appConfig } from '../config/app';
import { loadDemoSite, loadDemoSites } from '../demo/sites';
import type { CustomerSiteDetail, CustomerSiteSummary } from '../types/site';
import { apiRequest } from './client';

export async function getSites(): Promise<CustomerSiteSummary[]> {
  if (appConfig.demoMode) {
    return loadDemoSites();
  }

  return apiRequest<CustomerSiteSummary[]>('/customer/sites');
}

export async function getSite(siteId: string): Promise<CustomerSiteDetail> {
  if (appConfig.demoMode) {
    return loadDemoSite(siteId);
  }

  return apiRequest<CustomerSiteDetail>(`/customer/sites/${encodeURIComponent(siteId)}`);
}
