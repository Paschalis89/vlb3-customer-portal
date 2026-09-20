import type { CustomerDeviceDetail, DeviceSummary, PumpState } from '../types/device';

interface DemoDeviceRecord extends CustomerDeviceDetail {
  lastSeenOffsetSeconds: number | null;
}

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60_000).toISOString();

const initialDevices: DemoDeviceRecord[] = [
  {
    id: 'device-pozzonord-main',
    siteId: 'site-pozzonord',
    siteName: 'Pozzo Nord',
    siteLocationLabel: 'Settore Nord',
    name: 'Pompa principale',
    connectivity: 'ONLINE',
    pumpState: 'RUNNING',
    frequencyHz: 40,
    setpointHz: 40,
    hasFault: false,
    faultMessage: null,
    lastSeenAt: new Date().toISOString(),
    lastSeenOffsetSeconds: 3,
  },
  {
    id: 'device-camposud-main',
    siteId: 'site-camposud',
    siteName: 'Campo Sud',
    siteLocationLabel: 'Settore Sud',
    name: 'Pompa principale',
    connectivity: 'ONLINE',
    pumpState: 'STOPPED',
    frequencyHz: 0,
    setpointHz: 40,
    hasFault: false,
    faultMessage: null,
    lastSeenAt: new Date().toISOString(),
    lastSeenOffsetSeconds: 5,
  },
  {
    id: 'device-serra2-main',
    siteId: 'site-serra2',
    siteName: 'Serra 2',
    siteLocationLabel: 'Area serre',
    name: 'Pompa principale',
    connectivity: 'OFFLINE',
    pumpState: 'UNKNOWN',
    frequencyHz: null,
    setpointHz: 40,
    hasFault: false,
    faultMessage: null,
    lastSeenAt: minutesAgo(12),
    lastSeenOffsetSeconds: null,
  },
];

const devices = new Map<string, DemoDeviceRecord>(
  initialDevices.map((device) => [device.id, { ...device }]),
);

function cloneDevice(device: DemoDeviceRecord): CustomerDeviceDetail {
  const lastSeenAt =
    device.connectivity === 'ONLINE' && device.lastSeenOffsetSeconds !== null
      ? new Date(Date.now() - device.lastSeenOffsetSeconds * 1_000).toISOString()
      : device.lastSeenAt;

  return {
    id: device.id,
    siteId: device.siteId,
    siteName: device.siteName,
    siteLocationLabel: device.siteLocationLabel,
    name: device.name,
    connectivity: device.connectivity,
    pumpState: device.pumpState,
    frequencyHz: device.frequencyHz,
    setpointHz: device.setpointHz,
    hasFault: device.hasFault,
    faultMessage: device.faultMessage,
    lastSeenAt,
  };
}

export function getDemoDevice(deviceId: string): CustomerDeviceDetail | null {
  const device = devices.get(deviceId);
  return device ? cloneDevice(device) : null;
}

export function getDemoDevicesForSite(siteId: string): CustomerDeviceDetail[] {
  return Array.from(devices.values())
    .filter((device) => device.siteId === siteId)
    .map(cloneDevice);
}

export function toDeviceSummary(device: CustomerDeviceDetail): DeviceSummary {
  const {
    siteId: _siteId,
    siteName: _siteName,
    siteLocationLabel: _siteLocationLabel,
    faultMessage: _faultMessage,
    ...summary
  } = device;

  return summary;
}

export function updateDemoDevicePumpState(deviceId: string, pumpState: PumpState): void {
  const device = devices.get(deviceId);
  if (!device) {
    return;
  }

  device.pumpState = pumpState;
  device.frequencyHz = pumpState === 'RUNNING' ? device.setpointHz : 0;
  device.lastSeenAt = new Date().toISOString();
  device.lastSeenOffsetSeconds = 1;
}

export function updateDemoDeviceFrequency(deviceId: string, frequencyHz: number): void {
  const device = devices.get(deviceId);
  if (!device) {
    return;
  }

  device.setpointHz = frequencyHz;
  if (device.pumpState === 'RUNNING') {
    device.frequencyHz = frequencyHz;
  }
  device.lastSeenAt = new Date().toISOString();
  device.lastSeenOffsetSeconds = 1;
}
