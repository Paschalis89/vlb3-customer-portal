export type DeviceConnectivityStatus = 'ONLINE' | 'OFFLINE';

export type PumpState = 'RUNNING' | 'STOPPED' | 'FAULT' | 'UNKNOWN';

export interface DeviceSummary {
  id: string;
  name: string;
  connectivity: DeviceConnectivityStatus;
  pumpState: PumpState;
  frequencyHz: number | null;
  setpointHz: number | null;
  hasFault: boolean;
  lastSeenAt: string;
}

export interface CustomerDeviceDetail extends DeviceSummary {
  siteId: string;
  siteName: string;
  siteLocationLabel: string;
  faultMessage: string | null;
}
