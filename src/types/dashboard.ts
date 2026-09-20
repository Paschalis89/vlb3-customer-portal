import type { CustomerSiteSummary } from './site';

export interface DashboardMetrics {
  siteCount: number;
  onlineSiteCount: number;
  activePumpCount: number;
  activeAlertCount: number;
}

export interface DashboardData {
  organizationId: string;
  organizationName: string;
  generatedAt: string;
  metrics: DashboardMetrics;
  sites: CustomerSiteSummary[];
}
