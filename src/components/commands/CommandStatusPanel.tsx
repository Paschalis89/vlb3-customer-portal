import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Radio,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import type { CustomerCommand, CustomerCommandStatus } from '../../types/command';

interface CommandStatusPanelProps {
  command: CustomerCommand | null;
  error: string | null;
  onDismiss?: () => void;
}

interface CommandStatusDisplay {
  title: string;
  description: string;
  tone: 'progress' | 'success' | 'danger' | 'warning';
  icon: LucideIcon;
  spinning?: boolean;
}

const statusDisplay: Record<CustomerCommandStatus, CommandStatusDisplay> = {
  QUEUED: {
    title: 'Invio comando...',
    description: "Il comando è stato accettato ed è in attesa di essere consegnato all'impianto.",
    tone: 'progress',
    icon: LoaderCircle,
    spinning: true,
  },
  DELIVERED: {
    title: "Comando ricevuto dall'impianto...",
    description: 'Attendiamo la conferma di esecuzione prima di aggiornare lo stato della pompa.',
    tone: 'progress',
    icon: Radio,
  },
  SUCCEEDED: {
    title: 'Operazione completata',
    description: "L'impianto ha confermato che il comando è stato eseguito.",
    tone: 'success',
    icon: CheckCircle2,
  },
  FAILED: {
    title: 'Operazione non riuscita',
    description: "L'impianto non ha potuto eseguire il comando.",
    tone: 'danger',
    icon: XCircle,
  },
  EXPIRED: {
    title: "L'impianto non ha risposto in tempo",
    description: 'Il comando è scaduto senza una conferma di esecuzione.',
    tone: 'warning',
    icon: Clock3,
  },
};

export function CommandStatusPanel({ command, error, onDismiss }: CommandStatusPanelProps) {
  if (error) {
    return (
      <section className="command-status command-status--danger" aria-live="polite">
        <XCircle size={22} />
        <div>
          <strong>Impossibile eseguire il comando</strong>
          <span>{error}</span>
        </div>
        {onDismiss ? (
          <button className="command-status__dismiss" onClick={onDismiss} type="button">
            Chiudi
          </button>
        ) : null}
      </section>
    );
  }

  if (!command) {
    return null;
  }

  const display = statusDisplay[command.status];
  const Icon = display.icon;
  const message = command.failureMessage ?? display.description;

  return (
    <section
      className={`command-status command-status--${display.tone}`}
      aria-live="polite"
    >
      <Icon className={display.spinning ? 'spin' : undefined} size={22} />
      <div>
        <strong>{display.title}</strong>
        <span>{message}</span>
      </div>
      {onDismiss && ['SUCCEEDED', 'FAILED', 'EXPIRED'].includes(command.status) ? (
        <button className="command-status__dismiss" onClick={onDismiss} type="button">
          Chiudi
        </button>
      ) : null}
    </section>
  );
}
