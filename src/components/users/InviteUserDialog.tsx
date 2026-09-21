import { UserPlus, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { customerRoleLabels } from '../../auth/permissions';
import { assignableCustomerRoles, customerRoleDescriptions } from '../../lib/users';
import type { InviteCustomerUserInput } from '../../types/user';

interface InviteUserDialogProps {
  isOpen: boolean;
  isBusy: boolean;
  onClose: () => void;
  onSubmit: (input: InviteCustomerUserInput) => Promise<void>;
}

const initialForm: InviteCustomerUserInput = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'CUSTOMER_OPERATOR',
};

export function InviteUserDialog({ isOpen, isBusy, onClose, onSubmit }: InviteUserDialogProps) {
  const [form, setForm] = useState<InviteCustomerUserInput>(initialForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isBusy, isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await onSubmit(form);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Invito non riuscito.');
    }
  }

  return (
    <div
      className="user-dialog__backdrop"
      role="presentation"
      onMouseDown={() => {
        if (!isBusy) onClose();
      }}
    >
      <div
        aria-labelledby="invite-user-title"
        aria-modal="true"
        className="user-dialog"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Chiudi"
          className="user-dialog__close"
          disabled={isBusy}
          onClick={onClose}
          type="button"
        >
          <X size={19} />
        </button>

        <div className="user-dialog__icon" aria-hidden="true">
          <UserPlus size={22} />
        </div>
        <h2 id="invite-user-title">Invita utente</h2>
        <p>Aggiungi una persona della tua azienda e assegna il livello di accesso corretto.</p>

        <form className="user-form" onSubmit={handleSubmit}>
          <div className="user-form__grid">
            <label className="user-form__field">
              <span>Nome</span>
              <input
                autoComplete="given-name"
                disabled={isBusy}
                required
                value={form.firstName}
                onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
              />
            </label>

            <label className="user-form__field">
              <span>Cognome</span>
              <input
                autoComplete="family-name"
                disabled={isBusy}
                required
                value={form.lastName}
                onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
              />
            </label>
          </div>

          <label className="user-form__field">
            <span>Email</span>
            <input
              autoComplete="email"
              disabled={isBusy}
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </label>

          <label className="user-form__field">
            <span>Ruolo</span>
            <select
              disabled={isBusy}
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as InviteCustomerUserInput['role'],
                }))
              }
            >
              {assignableCustomerRoles.map((role) => (
                <option key={role} value={role}>
                  {customerRoleLabels[role]}
                </option>
              ))}
            </select>
            <small>{customerRoleDescriptions[form.role]}</small>
          </label>

          <div className="user-form__owner-note">
            Il ruolo Owner non è assegnabile dal Customer Portal.
          </div>

          {error ? <div className="form-error" role="alert">{error}</div> : null}

          <div className="user-dialog__actions">
            <button className="button button--secondary" disabled={isBusy} onClick={onClose} type="button">
              Annulla
            </button>
            <button className="button button--primary" disabled={isBusy} type="submit">
              {isBusy ? 'Invio...' : 'Invita utente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
