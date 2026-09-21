import { UserCog, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { customerRoleLabels } from '../../auth/permissions';
import { assignableCustomerRoles, customerRoleDescriptions } from '../../lib/users';
import type { CustomerUser, UpdateCustomerUserInput } from '../../types/user';

interface EditUserDialogProps {
  user: CustomerUser | null;
  isBusy: boolean;
  onClose: () => void;
  onSubmit: (userId: string, input: UpdateCustomerUserInput) => Promise<void>;
}

export function EditUserDialog({ user, isBusy, onClose, onSubmit }: EditUserDialogProps) {
  const [form, setForm] = useState<UpdateCustomerUserInput>({
    firstName: '',
    lastName: '',
    role: 'CUSTOMER_OPERATOR',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role === 'CUSTOMER_OWNER') {
      return;
    }

    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
    setError(null);
  }, [user]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isBusy, onClose, user]);

  if (!user || user.role === 'CUSTOMER_OWNER') {
    return null;
  }

  const targetUser = user;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await onSubmit(targetUser.id, form);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Modifica non riuscita.');
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
        aria-labelledby="edit-user-title"
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
          <UserCog size={22} />
        </div>
        <h2 id="edit-user-title">Modifica utente</h2>
        <p>{user.email}</p>

        <form className="user-form" onSubmit={handleSubmit}>
          <div className="user-form__grid">
            <label className="user-form__field">
              <span>Nome</span>
              <input
                disabled={isBusy}
                required
                value={form.firstName}
                onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
              />
            </label>

            <label className="user-form__field">
              <span>Cognome</span>
              <input
                disabled={isBusy}
                required
                value={form.lastName}
                onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
              />
            </label>
          </div>

          <label className="user-form__field">
            <span>Ruolo</span>
            <select
              disabled={isBusy}
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as UpdateCustomerUserInput['role'],
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

          {error ? <div className="form-error" role="alert">{error}</div> : null}

          <div className="user-dialog__actions">
            <button className="button button--secondary" disabled={isBusy} onClick={onClose} type="button">
              Annulla
            </button>
            <button className="button button--primary" disabled={isBusy} type="submit">
              {isBusy ? 'Salvataggio...' : 'Salva modifiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
