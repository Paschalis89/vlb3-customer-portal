import { readDemoSession } from './session';
import { getDemoDevice } from './deviceStore';
import type { CustomerCommand } from '../types/command';
import type {
  CustomerHistoryActor,
  CustomerHistoryCategory,
  CustomerHistoryEvent,
  CustomerHistoryEventType,
  CustomerHistoryResponse,
} from '../types/history';

const DEMO_LATENCY_MS = 260;
const DYNAMIC_HISTORY_STORAGE_KEY = 'vlb3-customer-portal.demo-history-events.v1';
const MAX_DYNAMIC_EVENTS = 50;

interface DemoSeedEvent {
  id: string;
  type: CustomerHistoryEventType;
  category: CustomerHistoryCategory;
  offsetMinutes: number;
  siteId: string;
  siteName: string;
  deviceId: string | null;
  deviceName: string | null;
  title: string;
  description: string;
  actor: CustomerHistoryActor | null;
  frequencyHz?: number | null;
}

const demoSeedEvents: DemoSeedEvent[] = [
  {
    id: 'history-demo-000',
    type: 'DEVICE_OFFLINE',
    category: 'CONNECTIVITY',
    offsetMinutes: 12,
    siteId: 'site-serra2',
    siteName: 'Serra 2',
    deviceId: 'device-serra2-main',
    deviceName: 'Pompa principale',
    title: 'Dispositivo offline',
    description: 'L’impianto ha perso il collegamento remoto.',
    actor: null,
  },
  {
    id: 'history-demo-001',
    type: 'PUMP_STOPPED',
    category: 'PUMP',
    offsetMinutes: 18,
    siteId: 'site-camposud',
    siteName: 'Campo Sud',
    deviceId: 'device-camposud-main',
    deviceName: 'Pompa principale',
    title: 'Pompa arrestata',
    description: 'La pompa principale è stata arrestata da remoto.',
    actor: { id: 'demo-user-owner', name: 'Mario Rossi' },
  },
  {
    id: 'history-demo-002',
    type: 'FREQUENCY_CHANGED',
    category: 'FREQUENCY',
    offsetMinutes: 42,
    siteId: 'site-pozzonord',
    siteName: 'Pozzo Nord',
    deviceId: 'device-pozzonord-main',
    deviceName: 'Pompa principale',
    title: 'Frequenza impostata a 42.00 Hz',
    description: 'Il setpoint della pompa principale è stato aggiornato.',
    actor: { id: 'demo-user-owner', name: 'Mario Rossi' },
    frequencyHz: 42,
  },
  {
    id: 'history-demo-003',
    type: 'PUMP_STARTED',
    category: 'PUMP',
    offsetMinutes: 45,
    siteId: 'site-pozzonord',
    siteName: 'Pozzo Nord',
    deviceId: 'device-pozzonord-main',
    deviceName: 'Pompa principale',
    title: 'Pompa avviata',
    description: 'La pompa principale è stata avviata da remoto.',
    actor: { id: 'demo-user-owner', name: 'Mario Rossi' },
  },
  {
    id: 'history-demo-004',
    type: 'ALERT_RESOLVED',
    category: 'ALERT',
    offsetMinutes: 132,
    siteId: 'site-pozzonord',
    siteName: 'Pozzo Nord',
    deviceId: 'device-pozzonord-main',
    deviceName: 'Pompa principale',
    title: 'Allarme risolto',
    description: 'La comunicazione con l’impianto è tornata disponibile.',
    actor: null,
  },
  {
    id: 'history-demo-005',
    type: 'DEVICE_ONLINE',
    category: 'CONNECTIVITY',
    offsetMinutes: 245,
    siteId: 'site-serra2',
    siteName: 'Serra 2',
    deviceId: 'device-serra2-main',
    deviceName: 'Pompa principale',
    title: 'Dispositivo tornato online',
    description: 'Il collegamento remoto dell’impianto è stato ripristinato.',
    actor: null,
  },
  {
    id: 'history-demo-006',
    type: 'DEVICE_OFFLINE',
    category: 'CONNECTIVITY',
    offsetMinutes: 263,
    siteId: 'site-serra2',
    siteName: 'Serra 2',
    deviceId: 'device-serra2-main',
    deviceName: 'Pompa principale',
    title: 'Dispositivo offline',
    description: 'L’impianto ha temporaneamente perso il collegamento remoto.',
    actor: null,
  },
  {
    id: 'history-demo-007',
    type: 'PUMP_STOPPED',
    category: 'PUMP',
    offsetMinutes: 24 * 60 + 62,
    siteId: 'site-pozzonord',
    siteName: 'Pozzo Nord',
    deviceId: 'device-pozzonord-main',
    deviceName: 'Pompa principale',
    title: 'Pompa arrestata',
    description: 'La pompa principale è stata arrestata da remoto.',
    actor: { id: 'demo-user-admin', name: 'Anna Bianchi' },
  },
  {
    id: 'history-demo-008',
    type: 'FREQUENCY_CHANGED',
    category: 'FREQUENCY',
    offsetMinutes: 24 * 60 + 118,
    siteId: 'site-pozzonord',
    siteName: 'Pozzo Nord',
    deviceId: 'device-pozzonord-main',
    deviceName: 'Pompa principale',
    title: 'Frequenza impostata a 38.50 Hz',
    description: 'Il setpoint della pompa principale è stato aggiornato.',
    actor: { id: 'demo-user-admin', name: 'Anna Bianchi' },
    frequencyHz: 38.5,
  },
  {
    id: 'history-demo-009',
    type: 'DEVICE_ONLINE',
    category: 'CONNECTIVITY',
    offsetMinutes: 2 * 24 * 60 + 84,
    siteId: 'site-camposud',
    siteName: 'Campo Sud',
    deviceId: 'device-camposud-main',
    deviceName: 'Pompa principale',
    title: 'Dispositivo tornato online',
    description: 'Il collegamento remoto dell’impianto è stato ripristinato.',
    actor: null,
  },
  {
    id: 'history-demo-010',
    type: 'ALERT_RESOLVED',
    category: 'ALERT',
    offsetMinutes: 3 * 24 * 60 + 96,
    siteId: 'site-camposud',
    siteName: 'Campo Sud',
    deviceId: 'device-camposud-main',
    deviceName: 'Pompa principale',
    title: 'Allarme risolto',
    description: 'Il collegamento dell’impianto è tornato stabile.',
    actor: null,
  },
  {
    id: 'history-demo-011',
    type: 'PUMP_STARTED',
    category: 'PUMP',
    offsetMinutes: 4 * 24 * 60 + 41,
    siteId: 'site-camposud',
    siteName: 'Campo Sud',
    deviceId: 'device-camposud-main',
    deviceName: 'Pompa principale',
    title: 'Pompa avviata',
    description: 'La pompa principale è stata avviata da remoto.',
    actor: { id: 'demo-user-operator', name: 'Luca Verdi' },
  },
  {
    id: 'history-demo-012',
    type: 'DEVICE_OFFLINE',
    category: 'CONNECTIVITY',
    offsetMinutes: 5 * 24 * 60 + 52,
    siteId: 'site-pozzonord',
    siteName: 'Pozzo Nord',
    deviceId: 'device-pozzonord-main',
    deviceName: 'Pompa principale',
    title: 'Dispositivo offline',
    description: 'L’impianto ha temporaneamente perso il collegamento remoto.',
    actor: null,
  },
];

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function offsetToIso(offsetMinutes: number, now: number): string {
  return new Date(now - offsetMinutes * 60_000).toISOString();
}

function buildSeedEvents(now: number): CustomerHistoryEvent[] {
  return demoSeedEvents.map((event) => ({
    id: event.id,
    type: event.type,
    category: event.category,
    occurredAt: offsetToIso(event.offsetMinutes, now),
    siteId: event.siteId,
    siteName: event.siteName,
    deviceId: event.deviceId,
    deviceName: event.deviceName,
    title: event.title,
    description: event.description,
    actor: event.actor,
    frequencyHz: event.frequencyHz ?? null,
  }));
}

function readDynamicEvents(): CustomerHistoryEvent[] {
  try {
    const stored = window.localStorage.getItem(DYNAMIC_HISTORY_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as CustomerHistoryEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeDynamicEvents(events: CustomerHistoryEvent[]): void {
  try {
    window.localStorage.setItem(
      DYNAMIC_HISTORY_STORAGE_KEY,
      JSON.stringify(events.slice(0, MAX_DYNAMIC_EVENTS)),
    );
  } catch {
    // Demo history persistence is optional. The portal keeps working without it.
  }
}

function currentActor(): CustomerHistoryActor | null {
  const user = readDemoSession();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
  };
}

function eventFromCommand(command: CustomerCommand): CustomerHistoryEvent | null {
  const device = getDemoDevice(command.deviceId);

  if (!device) {
    return null;
  }

  const base = {
    id: `history-${command.id}`,
    occurredAt: command.updatedAt,
    siteId: device.siteId,
    siteName: device.siteName,
    deviceId: device.id,
    deviceName: device.name,
    actor: currentActor(),
  };

  switch (command.type) {
    case 'VLB3_START':
      return {
        ...base,
        type: 'PUMP_STARTED',
        category: 'PUMP',
        title: 'Pompa avviata',
        description: `${device.name} avviata da remoto.`,
        frequencyHz: null,
      };
    case 'VLB3_STOP':
      return {
        ...base,
        type: 'PUMP_STOPPED',
        category: 'PUMP',
        title: 'Pompa arrestata',
        description: `${device.name} arrestata da remoto.`,
        frequencyHz: null,
      };
    case 'VLB3_SET_FREQUENCY': {
      if (command.frequencyHz === null) {
        return null;
      }

      return {
        ...base,
        type: 'FREQUENCY_CHANGED',
        category: 'FREQUENCY',
        title: `Frequenza impostata a ${command.frequencyHz.toFixed(2)} Hz`,
        description: `Il setpoint di ${device.name} è stato aggiornato.`,
        frequencyHz: command.frequencyHz,
      };
    }
  }
}

export function recordDemoCommandHistory(command: CustomerCommand): void {
  if (command.status !== 'SUCCEEDED') {
    return;
  }

  const event = eventFromCommand(command);
  if (!event) {
    return;
  }

  const existing = readDynamicEvents();
  if (existing.some((item) => item.id === event.id)) {
    return;
  }

  writeDynamicEvents([event, ...existing]);
}

export async function loadDemoHistory(): Promise<CustomerHistoryResponse> {
  await delay(DEMO_LATENCY_MS);

  const now = Date.now();
  const events = [...readDynamicEvents(), ...buildSeedEvents(now)].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );

  return {
    generatedAt: new Date(now).toISOString(),
    events,
  };
}
