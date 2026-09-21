import { BellOff, ShieldCheck } from 'lucide-react';

interface AlertsEmptyStateProps {
  activeView: boolean;
  filtered: boolean;
}

export function AlertsEmptyState({ activeView, filtered }: AlertsEmptyStateProps) {
  const Icon = activeView ? ShieldCheck : BellOff;
  const title = filtered
    ? 'Nessun allarme corrisponde al filtro'
    : activeView
      ? 'Nessun allarme attivo'
      : 'Nessun allarme nello storico';
  const message = filtered
    ? 'Prova a selezionare un filtro diverso per visualizzare altri eventi.'
    : activeView
      ? 'Gli impianti non hanno allarmi che richiedono attenzione in questo momento.'
      : 'Quando un allarme viene risolto comparira in questa sezione.';

  return (
    <div className="state-card state-card--empty alerts-empty-state">
      <div className="state-card__icon" aria-hidden="true">
        <Icon size={22} />
      </div>
      <div className="state-card__copy">
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
    </div>
  );
}
