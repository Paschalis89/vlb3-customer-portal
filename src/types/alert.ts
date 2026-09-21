export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AlertStatus = 'ACTIVE' | 'RESOLVED';

export type AlertFilter = 'ALL' | 'CRITICAL' | 'WARNING' | 'RESOLVED';

export interface CustomerAlert {
  id: string;
  siteId: string;
  siteName: string;
  deviceId: string | null;
  deviceName: string | null;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  recommendedAction: string | null;
  occurredAt: string;
  resolvedAt: string | null;
  resolutionMessage: string | null;
}

export interface CustomerAlertsResponse {
  generatedAt: string;
  active: CustomerAlert[];
  history: CustomerAlert[];
}
