import { appConfig } from '../config/app';
import { getDemoDashboard } from '../demo/dashboard';
import type { DashboardData } from '../types/dashboard';
import { apiRequest } from './client';

export async function getDashboard(): Promise<DashboardData> {
  if (appConfig.demoMode) {
    return getDemoDashboard();
  }

  return apiRequest<DashboardData>('/customer/dashboard');
}
