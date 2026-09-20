import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';

export function SiteDetailPage() {
  const { siteId } = useParams<{ siteId: string }>();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Dettaglio impianto"
        title="Impianto"
        description={`ID route: ${siteId ?? 'non disponibile'}`}
      />
      <div className="placeholder-card">
        <strong>Route pronta</strong>
        <span>I dispositivi dell'impianto verranno collegati nello STEP 4.</span>
      </div>
    </div>
  );
}
