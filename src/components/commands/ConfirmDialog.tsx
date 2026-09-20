import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmTone?: 'primary' | 'danger';
  isBusy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  confirmTone = 'primary',
  isBusy = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) {
        onCancel();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isBusy, isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirm-dialog__backdrop" role="presentation" onMouseDown={onCancel}>
      <div
        aria-describedby="confirm-dialog-description"
        aria-labelledby="confirm-dialog-title"
        aria-modal="true"
        className="confirm-dialog"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Chiudi"
          className="confirm-dialog__close"
          disabled={isBusy}
          onClick={onCancel}
          type="button"
        >
          <X size={19} />
        </button>

        <div className={`confirm-dialog__icon confirm-dialog__icon--${confirmTone}`}>
          <AlertTriangle size={22} />
        </div>

        <h2 id="confirm-dialog-title">{title}</h2>
        <p id="confirm-dialog-description">{description}</p>

        <div className="confirm-dialog__actions">
          <button
            className="button button--secondary"
            disabled={isBusy}
            onClick={onCancel}
            type="button"
          >
            Annulla
          </button>
          <button
            className={`button ${
              confirmTone === 'danger' ? 'button--danger' : 'button--primary'
            }`}
            disabled={isBusy}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
