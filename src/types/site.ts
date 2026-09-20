import type { DeviceConnectivityStatus, DeviceSummary } from './device';

export interface CustomerSiteSummary {
  id: string;
  name: string;
  description: string;
  locationLabel: string;
  connectivity: DeviceConnectivityStatus;
  deviceCount: number;
  activePumpCount: number;
  activeAlertCount: number;
  lastSeenAt: string;
  primaryDevice: DeviceSummary | null;
}

export interface CustomerSiteDetail extends CustomerSiteSummary {
  devices: DeviceSummary[];
}
