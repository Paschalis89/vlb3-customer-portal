import {
  AlertTriangle,
  ArrowLeft,
  CircleStop,
  Gauge,
  Power,
  Radio,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CommandStatusPanel } from '../components/commands/CommandStatusPanel';
import { ConfirmDialog } from '../components/commands/ConfirmDialog';
import { FrequencyControl } from '../components/devices/FrequencyControl';
import { PumpControls } from '../components/devices/PumpControls';
import { ErrorState } from '../components/ui/ErrorState';
import { PageHeader } from '../components/ui/PageHeader';
import { Skeleton } from '../components/ui/Skeleton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useDevice } from '../hooks/useDevice';
import { useDeviceCommand } from '../hooks/useDeviceCommand';
import { usePermissions } from '../hooks/usePermissions';
import { formatRelativeTime } from '../lib/date';
import type { CreateCustomerCommandRequest } from '../types/command';
import type { PumpState } from '../types/device';

type ConfirmationAction = 'START' | 'STOP' | null;

function pumpStateLabel(state: PumpState): string {
  switch (state) {
    case 'RUNNING':
      return 'IN FUNZIONE';
    case 'STOPPED':
      return 'FERMA';
    case 'FAULT':
      return 'IN ALLARME';
    case 'UNKNOWN':
      return 'NON DISPONIBILE';
  }
}

function DeviceDetailSkeleton() {
  return (
    <div className="page-stack">
      <div>
        <Skeleton className="skeleton--device-detail-title" />
        <Skeleton className="skeleton--device-detail-line" />
      </div>
      <Skeleton className="skeleton--device-hero" />
      <div className="device-controls-grid">
        <Skeleton className="skeleton--device-control" />
        <Skeleton className="skeleton--device-control" />
      </div>
      <Skeleton className="skeleton--device-telemetry" />
    </div>
  );
}

export function DeviceDetailPage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const { device, error, isLoading, isRefreshing, refresh } = useDevice(deviceId);
  const { can } = usePermissions();
  const [confirmation, setConfirmation] = useState<ConfirmationAction>(null);

  const handleCommandSucceeded = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const command = useDeviceCommand(deviceId ?? '', {
    onSucceeded: handleCommandSucceeded,
  });

  if (isLoading) {
    return <DeviceDetailSkeleton />;
  }

  if (error || !device) {
    return (
      <div className="page-stack">
        <Link className="back-link" to="/sites">
          <ArrowLeft size={16} />
          Torna agli impianti
        </Link>
        <ErrorState message={error ?? 'Dispositivo non disponibile.'} onRetry={refresh} />
      </div>
    );
  }

  const isOffline = device.connectivity === 'OFFLINE';
  const hasControlPermission =
    can('commands.start') || can('commands.stop') || can('commands.setFrequency');
  const frequencyDisabled =
    isOffline || device.hasFault || !can('commands.setFrequency');

  let frequencyDisabledReason: string | undefined;
  if (!can('commands.setFrequency')) {
    frequencyDisabledReason = 'Il tuo ruolo non consente di modificare la frequenza.';
  } else if (isOffline) {
    frequencyDisabledReason =
      "La frequenza potrà essere modificata quando l'impianto tornerà online.";
  } else if (device.hasFault) {
    frequencyDisabledReason = 'Modifica frequenza bloccata finché la pompa è in allarme.';
  }

  const execute = (request: CreateCustomerCommandRequest) => {
    void command.execute(request);
  };

  const confirmAction = () => {
    const action = confirmation;
    setConfirmation(null);

    if (action === 'START') {
      execute({ type: 'VLB3_START' });
    } else if (action === 'STOP') {
      execute({ type: 'VLB3_STOP' });
    }
  };

  return (
    <div className="page-stack">
      <Link className="back-link" to={`/sites/${device.siteId}`}>
        <ArrowLeft size={16} />
        {device.siteName}
      </Link>

      <PageHeader
        eyebrow="Controllo pompa"
        title={device.name}
        description={`${device.siteName} · ${device.siteLocationLabel}`}
        actions={
          <button
            className="button button--secondary button--compact"
            disabled={isRefreshing}
            onClick={() => void refresh()}
            type="button"
          >
            <RefreshCw className={isRefreshing ? 'spin' : undefined} size={16} />
            Aggiorna
          </button>
        }
      />

      <section className={`device-hero${isOffline ? ' device-hero--offline' : ''}`}>
        <div className="device-hero__top">
          <div>
            <span className="device-hero__eyebrow">Stato dispositivo</span>
            <div className="device-hero__status-line">
              <StatusBadge
                label={device.connectivity === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}
                tone={device.connectivity === 'ONLINE' ? 'success' : 'neutral'}
              />
              <span>Ultimo aggiornamento {formatRelativeTime(device.lastSeenAt)}</span>
            </div>
          </div>
          <div className="device-hero__pump-icon" aria-hidden="true">
            {isOffline ? <Radio size={28} /> : <Power size={28} />}
          </div>
        </div>

        <div className="device-hero__main">
          <div className="device-hero__pump-state">
            <span>Stato pompa</span>
            <strong
              className={
                device.pumpState === 'RUNNING'
                  ? 'is-success'
                  : device.pumpState === 'FAULT'
                    ? 'is-danger'
                    : undefined
              }
            >
              {pumpStateLabel(device.pumpState)}
            </strong>
          </div>
          <div className="device-hero__metric">
            <Gauge size={19} />
            <span>Frequenza</span>
            <strong>
              {device.frequencyHz === null ? '--' : `${device.frequencyHz.toFixed(2)} Hz`}
            </strong>
          </div>
          <div className="device-hero__metric">
            <SlidersHorizontal size={19} />
            <span>Setpoint</span>
            <strong>
              {device.setpointHz === null ? '--' : `${device.setpointHz.toFixed(2)} Hz`}
            </strong>
          </div>
        </div>
      </section>

      {isOffline ? (
        <section className="device-warning device-warning--offline">
          <Radio size={22} />
          <div>
            <strong>Impianto offline</strong>
            <span>
              I controlli remoti torneranno disponibili quando l'impianto sarà nuovamente
              collegato.
            </span>
          </div>
        </section>
      ) : null}

      {device.hasFault ? (
        <section className="device-warning device-warning--fault">
          <AlertTriangle size={22} />
          <div>
            <strong>Attenzione: pompa in allarme</strong>
            <span>{device.faultMessage ?? 'È presente un fault attivo sulla pompa.'}</span>
          </div>
        </section>
      ) : null}

      <CommandStatusPanel
        command={command.command}
        error={command.error}
        onDismiss={command.reset}
      />

      <div className="device-controls-grid">
        <PumpControls
          canStart={can('commands.start')}
          canStop={can('commands.stop')}
          device={device}
          isBusy={command.isPending}
          onStart={() => setConfirmation('START')}
          onStop={() => setConfirmation('STOP')}
        />

        <FrequencyControl
          disabled={frequencyDisabled}
          disabledReason={frequencyDisabledReason}
          isBusy={command.isPending}
          onSubmit={(frequencyHz) =>
            execute({ type: 'VLB3_SET_FREQUENCY', frequencyHz })
          }
          setpointHz={device.setpointHz}
        />
      </div>

      {!hasControlPermission ? (
        <section className="read-only-note">
          <Radio size={19} />
          <div>
            <strong>Modalità sola lettura</strong>
            <span>
              Puoi monitorare l'impianto, ma il tuo ruolo non consente di inviare comandi.
            </span>
          </div>
        </section>
      ) : null}

      <section className="device-telemetry-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Telemetria</p>
            <h2>Dati disponibili</h2>
            <p className="section-heading__description">
              Mostriamo soltanto valori già verificati e comprensibili per il cliente.
            </p>
          </div>
        </div>

        <div className="device-telemetry-grid">
          <div>
            <Power size={18} />
            <span>Stato</span>
            <strong>{pumpStateLabel(device.pumpState)}</strong>
          </div>
          <div>
            <Gauge size={18} />
            <span>Frequenza</span>
            <strong>
              {device.frequencyHz === null ? '--' : `${device.frequencyHz.toFixed(2)} Hz`}
            </strong>
          </div>
          <div>
            <SlidersHorizontal size={18} />
            <span>Setpoint</span>
            <strong>
              {device.setpointHz === null ? '--' : `${device.setpointHz.toFixed(2)} Hz`}
            </strong>
          </div>
          <div>
            {device.hasFault ? <AlertTriangle size={18} /> : <CircleStop size={18} />}
            <span>Fault</span>
            <strong className={device.hasFault ? 'is-danger' : 'is-success'}>
              {device.hasFault ? device.faultMessage ?? 'Allarme attivo' : 'Nessuno'}
            </strong>
          </div>
        </div>
      </section>

      <ConfirmDialog
        confirmLabel={confirmation === 'STOP' ? 'Arresta' : 'Avvia'}
        confirmTone={confirmation === 'STOP' ? 'danger' : 'primary'}
        description={
          confirmation === 'STOP'
            ? `Arrestare la pompa ${device.siteName}? Il comando verrà inviato all'impianto.`
            : `Avviare la pompa ${device.siteName}? Il comando verrà inviato all'impianto.`
        }
        isBusy={command.isPending}
        isOpen={confirmation !== null}
        onCancel={() => setConfirmation(null)}
        onConfirm={confirmAction}
        title={confirmation === 'STOP' ? 'Conferma arresto pompa' : 'Conferma avvio pompa'}
      />
    </div>
  );
}
