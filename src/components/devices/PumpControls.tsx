import { CircleStop, Play } from 'lucide-react';
import type { CustomerDeviceDetail } from '../../types/device';

interface PumpControlsProps {
  device: CustomerDeviceDetail;
  canStart: boolean;
  canStop: boolean;
  isBusy: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function PumpControls({
  device,
  canStart,
  canStop,
  isBusy,
  onStart,
  onStop,
}: PumpControlsProps) {
  const isOffline = device.connectivity === 'OFFLINE';
  const startBlockedByFault = device.hasFault;
  const startDisabled =
    isBusy ||
    isOffline ||
    startBlockedByFault ||
    !canStart ||
    device.pumpState === 'RUNNING';
  const stopDisabled =
    isBusy || isOffline || !canStop || device.pumpState === 'STOPPED' || device.pumpState === 'UNKNOWN';

  let helper = 'START e STOP richiedono sempre una conferma prima dell’invio.';

  if (!canStart && !canStop) {
    helper = 'Il tuo ruolo consente la sola visualizzazione. I comandi remoti non sono disponibili.';
  } else if (isOffline) {
    helper = "I controlli remoti torneranno disponibili quando l'impianto sarà nuovamente collegato.";
  } else if (startBlockedByFault) {
    helper = 'La pompa è in allarme: START è bloccato. STOP resta disponibile se necessario.';
  }

  return (
    <section className="device-control-card">
      <div className="device-control-card__heading">
        <div>
          <span>Controlli</span>
          <h2>Avvio e arresto</h2>
        </div>
      </div>

      <div className="pump-control-buttons">
        <button
          className="pump-control-button pump-control-button--start"
          disabled={startDisabled}
          onClick={onStart}
          type="button"
        >
          <Play size={22} fill="currentColor" />
          <span>
            <small>Pompa</small>
            START
          </span>
        </button>

        <button
          className="pump-control-button pump-control-button--stop"
          disabled={stopDisabled}
          onClick={onStop}
          type="button"
        >
          <CircleStop size={23} />
          <span>
            <small>Pompa</small>
            STOP
          </span>
        </button>
      </div>

      <p className="device-control-card__helper">{helper}</p>
    </section>
  );
}
