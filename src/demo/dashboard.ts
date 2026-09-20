import type { DashboardData } from '../types/dashboard';
import { getDemoSites } from './sites';

const DEMO_ORGANIZATION_ID = 'demo-organization';
const DEMO_ORGANIZATION_NAME = 'Azienda Agricola Demo';
const DEMO_LATENCY_MS = 240;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export async function getDemoDashboard(): Promise<DashboardData> {
  await delay(DEMO_LATENCY_MS);

  const sites = getDemoSites();

  return {
    organizationId: DEMO_ORGANIZATION_ID,
    organizationName: DEMO_ORGANIZATION_NAME,
    generatedAt: new Date().toISOString(),
    metrics: {
      siteCount: sites.length,
      onlineSiteCount: sites.filter((site) => site.connectivity === 'ONLINE').length,
      activePumpCount: sites.reduce((total, site) => total + site.activePumpCount, 0),
      activeAlertCount: sites.reduce((total, site) => total + site.activeAlertCount, 0),
    },
    sites,
  };
}
