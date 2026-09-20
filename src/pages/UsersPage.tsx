import { PageHeader } from '../components/ui/PageHeader';

export function UsersPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Azienda"
        title="Utenti"
        description="Gestione utenti e ruoli per Owner e Admin."
      />
      <div className="placeholder-card">
        <strong>STEP 9</strong>
        <span>Owner, Admin, Operator e Viewer con permessi verificati anche dal backend.</span>
      </div>
    </div>
  );
}
