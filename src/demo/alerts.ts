import { getCustomerAlertCopy } from '../lib/alerts';
import type {
  AlertSeverity,
  AlertStatus,
  CustomerAlert,
  CustomerAlertsResponse,
} from '../types/alert';

const DEMO_LATENCY_MS = 260;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

interface DemoRawAlert {
  id: string;
  technicalCode: string;
  siteId: string;
  siteName: string;
  deviceId: string | null;
  deviceName: string | null;
  severity: AlertSeverity;
  status: AlertStatus;
  occurredAtOffsetMinutes: number;
  resolvedAtOffsetMinutes: number | null;
  resolutionMessage: string | null;
}

const demoRawAlerts: DemoRawAlert[] = [
  {
    id: 'alert-demo-001',
    technicalCode: 'MODBUS_CONNECTION_ERROR',
    siteId: 'site-pozzonord',
    siteName: 'Pozzo Nord',
    deviceId: 'device-pozzonord-main',
    deviceName: 'Pompa principale',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    occurredAtOffsetMinutes: 20 * 60 + 28,
    resolvedAtOffsetMinutes: 20 * 60 + 21,
    resolutionMessage: 'La comunicazione e stata ripristinata automaticamente.',
  },
  {
    id: 'alert-demo-002',
    technicalCode: 'COMMUNICATION_SIGNAL_WEAK',
    siteId: 'site-camposud',
    siteName: 'Campo Sud',
    deviceId: 'device-camposud-main',
    deviceName: 'Pompa principale',
    severity: 'WARNING',
    status: 'RESOLVED',
    occurredAtOffsetMinutes: 34 * 60 + 12,
    resolvedAtOffsetMinutes: 33 * 60 + 56,
    resolutionMessage: 'Il collegamento e tornato stabile.',
  },
  {
    id: 'alert-demo-003',
    technicalCode: 'DEVICE_OFFLINE',
    siteId: 'site-serra2',
    siteName: 'Serra 2',
    deviceId: 'device-serra2-main',
    deviceName: 'Pompa principale',
    severity: 'WARNING',
    status: 'RESOLVED',
    occurredAtOffsetMinutes: 3 * 24 * 60 + 5 * 60,
    resolvedAtOffsetMinutes: 3 * 24 * 60 + 4 * 60 + 47,
    resolutionMessage: 'Il dispositivo si e ricollegato al servizio remoto.',
  },
  {
    id: 'alert-demo-004',
    technicalCode: 'VLB3_FAULT',
    siteId: 'site-pozzonord',
    siteName: 'Pozzo Nord',
    deviceId: 'device-pozzonord-main',
    deviceName: 'Pompa principale',
    severity: 'CRITICAL',
    status: 'RESOLVED',
    occurredAtOffsetMinutes: 8 * 24 * 60 + 2 * 60 + 18,
    resolvedAtOffsetMinutes: 8 * 24 * 60 + 60 + 42,
    resolutionMessage: 'Il tecnico ha verificato l\'impianto e l\'allarme e stato chiuso.',
  },
];

function minutesAgoToIso(offsetMinutes: number, now: number): string {
  return new Date(now - offsetMinutes * 60_000).toISOString();
}

function toCustomerAlert(raw: DemoRawAlert, now: number): CustomerAlert {
  const copy = getCustomerAlertCopy(raw.technicalCode);

  return {
    id: raw.id,
    siteId: raw.siteId,
    siteName: raw.siteName,
    deviceId: raw.deviceId,
    deviceName: raw.deviceName,
    severity: raw.severity,
    status: raw.status,
    title: copy.title,
    message: copy.message,
    recommendedAction: copy.recommendedAction,
    occurredAt: minutesAgoToIso(raw.occurredAtOffsetMinutes, now),
    resolvedAt:
      raw.resolvedAtOffsetMinutes === null
        ? null
        : minutesAgoToIso(raw.resolvedAtOffsetMinutes, now),
    resolutionMessage: raw.resolutionMessage,
  };
}

function buildDemoAlertsResponse(): CustomerAlertsResponse {
  const now = Date.now();
  const alerts = demoRawAlerts
    .map((raw) => toCustomerAlert(raw, now))
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  return {
    generatedAt: new Date(now).toISOString(),
    active: alerts.filter((alert) => alert.status === 'ACTIVE'),
    history: alerts.filter((alert) => alert.status === 'RESOLVED'),
  };
}

export async function loadDemoAlerts(): Promise<CustomerAlertsResponse> {
  await delay(DEMO_LATENCY_MS);
  return buildDemoAlertsResponse();
}
