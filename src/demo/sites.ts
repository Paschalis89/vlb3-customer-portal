import type { CustomerSiteDetail, CustomerSiteSummary } from '../types/site';

const secondsAgo = (seconds: number): string =>
  new Date(Date.now() - seconds * 1_000).toISOString();

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60_000).toISOString();

const DEMO_LATENCY_MS = 220;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function buildDemoSites(): CustomerSiteDetail[] {
  const pozzoNordDevice = {
    id: 'device-pozzonord-main',
    name: 'Pompa principale',
    connectivity: 'ONLINE' as const,
    pumpState: 'RUNNING' as const,
    frequencyHz: 40,
    setpointHz: 40,
    hasFault: false,
    lastSeenAt: secondsAgo(3),
  };

  const campoSudDevice = {
    id: 'device-camposud-main',
    name: 'Pompa principale',
    connectivity: 'ONLINE' as const,
    pumpState: 'STOPPED' as const,
    frequencyHz: 0,
    setpointHz: 40,
    hasFault: false,
    lastSeenAt: secondsAgo(5),
  };

  const serra2Device = {
    id: 'device-serra2-main',
    name: 'Pompa principale',
    connectivity: 'OFFLINE' as const,
    pumpState: 'UNKNOWN' as const,
    frequencyHz: null,
    setpointHz: 40,
    hasFault: false,
    lastSeenAt: minutesAgo(12),
  };

  return [
    {
      id: 'site-pozzonord',
      name: 'Pozzo Nord',
      description: 'Pozzo irrigazione settore nord',
      locationLabel: 'Settore Nord',
      connectivity: 'ONLINE',
      deviceCount: 1,
      activePumpCount: 1,
      activeAlertCount: 0,
      lastSeenAt: pozzoNordDevice.lastSeenAt,
      primaryDevice: pozzoNordDevice,
      devices: [pozzoNordDevice],
    },
    {
      id: 'site-camposud',
      name: 'Campo Sud',
      description: 'Irrigazione campo sud',
      locationLabel: 'Settore Sud',
      connectivity: 'ONLINE',
      deviceCount: 1,
      activePumpCount: 0,
      activeAlertCount: 0,
      lastSeenAt: campoSudDevice.lastSeenAt,
      primaryDevice: campoSudDevice,
      devices: [campoSudDevice],
    },
    {
      id: 'site-serra2',
      name: 'Serra 2',
      description: 'Impianto di servizio serra 2',
      locationLabel: 'Area serre',
      connectivity: 'OFFLINE',
      deviceCount: 1,
      activePumpCount: 0,
      activeAlertCount: 0,
      lastSeenAt: serra2Device.lastSeenAt,
      primaryDevice: serra2Device,
      devices: [serra2Device],
    },
  ];
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

  const site = buildDemoSites().find((candidate) => candidate.id === siteId);

  if (!site) {
    throw new Error('Impianto non trovato.');
  }

  return site;
}
