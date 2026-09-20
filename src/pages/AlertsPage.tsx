import { PageHeader } from '../components/ui/PageHeader';

export function AlertsPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Monitoraggio"
        title="Allarmi"
        description="Allarmi attivi e storico in un linguaggio semplice per il cliente."
      />
      <div className="placeholder-card">
        <strong>STEP 7</strong>
        <span>Nessun dettaglio Modbus o diagnostica interna verrà esposto in questa sezione.</span>
      </div>
    </div>
  );
}
