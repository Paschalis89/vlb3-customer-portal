import { PageHeader } from '../components/ui/PageHeader';

export function HistoryPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Attività"
        title="Storico"
        description="Timeline delle operazioni utili al cliente e degli eventi principali."
      />
      <div className="placeholder-card">
        <strong>STEP 8</strong>
        <span>START, STOP, variazioni di frequenza, allarmi e stato di connessione.</span>
      </div>
    </div>
  );
}
