import { Building2 } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="state-card state-card--empty">
      <div className="state-card__icon" aria-hidden="true">
        <Building2 size={22} />
      </div>
      <div className="state-card__copy">
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
    </div>
  );
}
