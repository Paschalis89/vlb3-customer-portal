import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';

export function DeviceDetailPage() {
  const { deviceId } = useParams<{ deviceId: string }>();

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Dettaglio dispositivo"
        title="Pompa"
        description={`ID route: ${deviceId ?? 'non disponibile'}`}
      />
      <div className="placeholder-card">
        <strong>Route pronta</strong>
        <span>START, STOP e frequenza 30-50 Hz arriveranno nello STEP 5.</span>
      </div>
    </div>
  );
}
