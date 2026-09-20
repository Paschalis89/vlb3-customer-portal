import { Minus, Plus, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface FrequencyControlProps {
  setpointHz: number | null;
  disabled: boolean;
  disabledReason?: string;
  isBusy: boolean;
  onSubmit: (frequencyHz: number) => void;
}

const MIN_FREQUENCY = 30;
const MAX_FREQUENCY = 50;
const FREQUENCY_STEP = 0.5;

function clampFrequency(value: number): number {
  return Math.min(MAX_FREQUENCY, Math.max(MIN_FREQUENCY, value));
}

function roundFrequency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function FrequencyControl({
  setpointHz,
  disabled,
  disabledReason,
  isBusy,
  onSubmit,
}: FrequencyControlProps) {
  const initialValue = setpointHz ?? 40;
  const [frequency, setFrequency] = useState(initialValue);

  useEffect(() => {
    if (setpointHz !== null) {
      setFrequency(setpointHz);
    }
  }, [setpointHz]);

  const isValid = useMemo(
    () => Number.isFinite(frequency) && frequency >= MIN_FREQUENCY && frequency <= MAX_FREQUENCY,
    [frequency],
  );

  const controlsDisabled = disabled || isBusy;

  const changeBy = (delta: number) => {
    setFrequency((current) => roundFrequency(clampFrequency(current + delta)));
  };

  const onNumberChange = (rawValue: string) => {
    const parsed = Number(rawValue);
    if (Number.isFinite(parsed)) {
      setFrequency(parsed);
    }
  };

  return (
    <section className="device-control-card">
      <div className="device-control-card__heading">
        <div>
          <span>Frequenza</span>
          <h2>Setpoint pompa</h2>
        </div>
        <SlidersHorizontal size={21} />
      </div>

      <div className="frequency-value">
        <strong>{frequency.toFixed(2)}</strong>
        <span>Hz</span>
      </div>

      <div className="frequency-slider-row">
        <span>30 Hz</span>
        <input
          aria-label="Frequenza pompa"
          disabled={controlsDisabled}
          max={MAX_FREQUENCY}
          min={MIN_FREQUENCY}
          onChange={(event) => setFrequency(Number(event.target.value))}
          step={FREQUENCY_STEP}
          type="range"
          value={clampFrequency(frequency)}
        />
        <span>50 Hz</span>
      </div>

      <div className="frequency-input-row">
        <button
          aria-label="Riduci frequenza"
          className="frequency-step-button"
          disabled={controlsDisabled || frequency <= MIN_FREQUENCY}
          onClick={() => changeBy(-FREQUENCY_STEP)}
          type="button"
        >
          <Minus size={20} />
        </button>

        <label className="frequency-number-input">
          <span className="sr-only">Frequenza in Hertz</span>
          <input
            disabled={controlsDisabled}
            max={MAX_FREQUENCY}
            min={MIN_FREQUENCY}
            onChange={(event) => onNumberChange(event.target.value)}
            step={FREQUENCY_STEP}
            type="number"
            value={frequency}
          />
          <span>Hz</span>
        </label>

        <button
          aria-label="Aumenta frequenza"
          className="frequency-step-button"
          disabled={controlsDisabled || frequency >= MAX_FREQUENCY}
          onClick={() => changeBy(FREQUENCY_STEP)}
          type="button"
        >
          <Plus size={20} />
        </button>
      </div>

      {!isValid ? (
        <p className="frequency-validation">Inserisci un valore compreso tra 30.00 e 50.00 Hz.</p>
      ) : null}

      <button
        className="button button--primary button--full frequency-submit"
        disabled={controlsDisabled || !isValid || frequency === setpointHz}
        onClick={() => onSubmit(roundFrequency(frequency))}
        type="button"
      >
        Imposta frequenza
      </button>

      <p className="device-control-card__helper">
        {disabledReason ?? 'Range consentito: da 30.00 Hz a 50.00 Hz.'}
      </p>
    </section>
  );
}
