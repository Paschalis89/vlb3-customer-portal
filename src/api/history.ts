import { appConfig } from '../config/app';
import { loadDemoHistory } from '../demo/history';
import type { CustomerHistoryResponse } from '../types/history';
import { apiRequest } from './client';

export async function getHistory(): Promise<CustomerHistoryResponse> {
  if (appConfig.demoMode) {
    return loadDemoHistory();
  }

  return apiRequest<CustomerHistoryResponse>('/customer/history');
}
