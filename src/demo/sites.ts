import { getDemoDevicesForSite, toDeviceSummary } from './deviceStore';
import type { CustomerSiteDetail, CustomerSiteSummary } from '../types/site';

const DEMO_LATENCY_MS = 220;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

interface DemoSiteDefinition {
  id: string;
  name: string;
  description: string;
  locationLabel: string;
}

const siteDefinitions: DemoSiteDefinition[] = [
  {
    id: 'site-pozzonord',
    name: 'Pozzo Nord',
    description: 'Pozzo irrigazione settore nord',
    locationLabel: 'Settore Nord',
  },
  {
    id: 'site-camposud',
    name: 'Campo Sud',
    description: 'Irrigazione campo sud',
    locationLabel: 'Settore Sud',
  },
  {
    id: 'site-serra2',
    name: 'Serra 2',
    description: 'Impianto di servizio serra 2',
    locationLabel: 'Area serre',
  },
];

function buildDemoSite(definition: DemoSiteDefinition): CustomerSiteDetail {
  const deviceDetails = getDemoDevicesForSite(definition.id);
  const devices = deviceDetails.map(toDeviceSummary);
  const onlineDevices = devices.filter((device) => device.connectivity === 'ONLINE');
  const primaryDevice = devices[0] ?? null;
  const lastSeenAt =
    devices
      .map((device) => device.lastSeenAt)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ??
    new Date().toISOString();

  return {
    ...definition,
    connectivity: onlineDevices.length > 0 ? 'ONLINE' : 'OFFLINE',
    deviceCount: devices.length,
    activePumpCount: devices.filter((device) => device.pumpState === 'RUNNING').length,
    activeAlertCount: devices.filter((device) => device.hasFault).length,
    lastSeenAt,
    primaryDevice,
    devices,
  };
}

function buildDemoSites(): CustomerSiteDetail[] {
  return siteDefinitions.map(buildDemoSite);
}

function toSummary(site: CustomerSiteDetail): CustomerSiteSummary {
  const { devices: _devices, ...summary } = site;
  return summary;
}

export function getDemoSites(): CustomerSiteSummary[] {
  return buildDemoSites().map(toSummary);
}

export async function loadDemoSites(): Promise<CustomerSiteSummary[]> {
  await delay(DEMO_LATENCY_MS);
  return getDemoSites();
}

export async function loadDemoSite(siteId: string): Promise<CustomerSiteDetail> {
  await delay(DEMO_LATENCY_MS);

  const definition = siteDefinitions.find((candidate) => candidate.id === siteId);

  if (!definition) {
    throw new Error('Impianto non trovato.');
  }

  return buildDemoSite(definition);
}
