import type { CustomerSiteSummary } from '../types/site';

const secondsAgo = (seconds: number): string =>
  new Date(Date.now() - seconds * 1_000).toISOString();

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60_000).toISOString();

export function getDemoSites(): CustomerSiteSummary[] {
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
      lastSeenAt: secondsAgo(3),
      primaryDevice: {
        id: 'device-pozzonord-main',
        name: 'Pompa principale',
        connectivity: 'ONLINE',
        pumpState: 'RUNNING',
        frequencyHz: 40,
        setpointHz: 40,
        hasFault: false,
        lastSeenAt: secondsAgo(3),
      },
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
      lastSeenAt: secondsAgo(5),
      primaryDevice: {
        id: 'device-camposud-main',
        name: 'Pompa principale',
        connectivity: 'ONLINE',
        pumpState: 'STOPPED',
        frequencyHz: 0,
        setpointHz: 40,
        hasFault: false,
        lastSeenAt: secondsAgo(5),
      },
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
      lastSeenAt: minutesAgo(12),
      primaryDevice: {
        id: 'device-serra2-main',
        name: 'Pompa principale',
        connectivity: 'OFFLINE',
        pumpState: 'UNKNOWN',
        frequencyHz: null,
        setpointHz: 40,
        hasFault: false,
        lastSeenAt: minutesAgo(12),
      },
    },
  ];
}
