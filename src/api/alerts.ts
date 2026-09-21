import { appConfig } from '../config/app';
import { loadDemoAlerts } from '../demo/alerts';
import type { CustomerAlertsResponse } from '../types/alert';
import { apiRequest } from './client';

export async function getAlerts(): Promise<CustomerAlertsResponse> {
  if (appConfig.demoMode) {
    return loadDemoAlerts();
  }

  return apiRequest<CustomerAlertsResponse>('/customer/alerts');
}
