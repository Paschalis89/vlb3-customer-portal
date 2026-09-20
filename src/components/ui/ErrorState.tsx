import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Impossibile caricare i dati',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state-card state-card--error" role="alert">
      <div className="state-card__icon" aria-hidden="true">
        <AlertTriangle size={22} />
      </div>
      <div className="state-card__copy">
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
      {onRetry ? (
        <button className="button button--secondary" type="button" onClick={onRetry}>
          <RefreshCw size={17} />
          Riprova
        </button>
      ) : null}
    </div>
  );
}
