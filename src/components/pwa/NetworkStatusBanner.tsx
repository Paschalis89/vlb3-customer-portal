import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export function NetworkStatusBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="network-status-banner" role="status" aria-live="polite">
      <WifiOff size={18} />
      <div>
        <strong>Connessione non disponibile</strong>
        <span>
          Il portale può aprire le schermate già caricate, ma i dati dinamici non vengono
          mostrati dalla cache come se fossero realtime. I controlli remoti richiedono una
          connessione attiva.
        </span>
      </div>
    </div>
  );
}
