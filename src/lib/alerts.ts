import type { AlertSeverity } from '../types/alert';

export interface CustomerAlertCopy {
  title: string;
  message: string;
  recommendedAction: string | null;
}

const technicalAlertCopy: Record<string, CustomerAlertCopy> = {
  MODBUS_CONNECTION_ERROR: {
    title: 'Comunicazione non disponibile',
    message: "La comunicazione con l'inverter non e momentaneamente disponibile.",
    recommendedAction:
      "Attendi qualche minuto. Se il problema continua, verifica che l'impianto sia alimentato e contatta l'assistenza.",
  },
  COMMUNICATION_SIGNAL_WEAK: {
    title: 'Collegamento instabile',
    message: "Il collegamento dell'impianto risulta instabile e potrebbe interrompersi temporaneamente.",
    recommendedAction:
      "Continua a monitorare l'impianto. Se l'avviso si ripete frequentemente, contatta l'assistenza.",
  },
  DEVICE_OFFLINE: {
    title: 'Impianto temporaneamente offline',
    message: "L'impianto ha perso temporaneamente il collegamento al servizio remoto.",
    recommendedAction:
      "Verifica l'alimentazione e la connettivita dell'impianto. I controlli remoti torneranno disponibili quando sara di nuovo online.",
  },
  VLB3_FAULT: {
    title: 'Pompa in allarme',
    message: "L'inverter ha segnalato un'anomalia che richiede attenzione.",
    recommendedAction:
      "Non forzare l'avvio della pompa. Controlla l'impianto e, se necessario, contatta il tecnico di riferimento.",
  },
};

const fallbackCopy: CustomerAlertCopy = {
  title: 'Anomalia impianto',
  message: "E stata rilevata un'anomalia sull'impianto.",
  recommendedAction: "Controlla lo stato dell'impianto e contatta l'assistenza se il problema persiste.",
};

export function getCustomerAlertCopy(technicalCode: string): CustomerAlertCopy {
  return technicalAlertCopy[technicalCode] ?? fallbackCopy;
}

export function getAlertSeverityLabel(severity: AlertSeverity): string {
  switch (severity) {
    case 'CRITICAL':
      return 'Critico';
    case 'WARNING':
      return 'Warning';
    case 'INFO':
      return 'Informativo';
  }
}

export function getAlertSeverityTone(
  severity: AlertSeverity,
): 'danger' | 'warning' | 'neutral' {
  switch (severity) {
    case 'CRITICAL':
      return 'danger';
    case 'WARNING':
      return 'warning';
    case 'INFO':
      return 'neutral';
  }
}
