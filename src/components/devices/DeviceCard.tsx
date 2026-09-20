import {
  AlertTriangle,
  ArrowRight,
  CircleStop,
  Gauge,
  Power,
  Radio,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../lib/date';
import type { DeviceSummary, PumpState } from '../../types/device';
import { StatusBadge, type StatusTone } from '../ui/StatusBadge';

interface DeviceCardProps {
  device: DeviceSummary;
}

interface PumpDisplay {
  label: string;
  tone: StatusTone;
  icon: LucideIcon;
}

function getPumpDisplay(state: PumpState): PumpDisplay {
  switch (state) {
    case 'RUNNING':
      return { label: 'IN FUNZIONE', tone: 'success', icon: Power };
    case 'STOPPED':
      return { label: 'FERMA', tone: 'neutral', icon: CircleStop };
    case 'FAULT':
      return { label: 'IN ALLARME', tone: 'danger', icon: AlertTriangle };
    case 'UNKNOWN':
      return { label: 'NON DISPONIBILE', tone: 'neutral', icon: Radio };
  }
}

export function DeviceCard({ device }: DeviceCardProps) {
  const isOffline = device.connectivity === 'OFFLINE';
  const pump = getPumpDisplay(device.pumpState);
  const PumpIcon = pump.icon;

  return (
    <article className={`device-card${isOffline ? ' device-card--offline' : ''}`}>
      <div className="device-card__header">
        <div>
          <span className="device-card__eyebrow">VLB3</span>
          <h3>{device.name}</h3>
        </div>
        <StatusBadge
          label={device.connectivity === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}
          tone={device.connectivity === 'ONLINE' ? 'success' : 'neutral'}
        />
      </div>

      {isOffline ? (
        <div className="device-card__offline">
          <Radio size={19} />
          <div>
            <strong>Dispositivo non collegato</strong>
            <span>Ultimo collegamento {formatRelativeTime(device.lastSeenAt)}</span>
          </div>
        </div>
      ) : (
        <div className="device-card__metrics">
          <div>
            <span>Stato pompa</span>
            <strong className={`device-card__pump device-card__pump--${pump.tone}`}>
              <PumpIcon size={17} />
              {pump.label}
            </strong>
          </div>
          <div>
            <span>Frequenza</span>
            <strong>
              <Gauge size={17} />
              {device.frequencyHz === null ? '--' : `${device.frequencyHz.toFixed(2)} Hz`}
            </strong>
          </div>
          <div>
            <span>Setpoint</span>
            <strong>
              <SlidersHorizontal size={17} />
              {device.setpointHz === null ? '--' : `${device.setpointHz.toFixed(2)} Hz`}
            </strong>
          </div>
        </div>
      )}

      <div className={`device-card__fault${device.hasFault ? ' device-card__fault--active' : ''}`}>
        {device.hasFault ? <AlertTriangle size={16} /> : <Power size={16} />}
        <span>{device.hasFault ? 'Pompa in allarme' : 'Nessun fault attivo'}</span>
      </div>

      <Link className="device-card__open" to={`/devices/${device.id}`}>
        <span>Apri dispositivo</span>
        <ArrowRight size={17} />
      </Link>
    </article>
  );
}
