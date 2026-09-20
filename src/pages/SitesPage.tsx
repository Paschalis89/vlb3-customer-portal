import { PageHeader } from '../components/ui/PageHeader';

export function SitesPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Impianti"
        title="I tuoi impianti"
        description="Qui troverai ricerca, filtri e stato di tutti i siti della tua azienda."
      />
      <div className="placeholder-card">
        <strong>STEP 4</strong>
        <span>Lista impianti, ricerca e filtri saranno implementati dopo dashboard e autenticazione.</span>
      </div>
    </div>
  );
}
