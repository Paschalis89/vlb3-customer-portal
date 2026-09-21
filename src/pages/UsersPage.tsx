import {
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  UserRoundCog,
  UserX,
  Waves,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { customerRoleLabels } from '../auth/permissions';
import { ConfirmDialog } from '../components/commands/ConfirmDialog';
import { EditUserDialog } from '../components/users/EditUserDialog';
import { InviteUserDialog } from '../components/users/InviteUserDialog';
import { UserRow } from '../components/users/UserRow';
import { UsersSkeleton } from '../components/users/UsersSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { PageHeader } from '../components/ui/PageHeader';
import { appConfig } from '../config/app';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { formatTime } from '../lib/date';
import type { CustomerRole } from '../types/auth';
import type {
  CustomerUser,
  CustomerUserStatus,
  InviteCustomerUserInput,
  UpdateCustomerUserInput,
} from '../types/user';

type RoleFilter = 'ALL' | CustomerRole;
type StatusFilter = 'ALL' | CustomerUserStatus;

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const {
    data,
    error,
    isLoading,
    isRefreshing,
    mutatingUserId,
    isInviting,
    refresh,
    invite,
    update,
    setStatus,
  } = useUsers(currentUser);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<CustomerUser | null>(null);
  const [statusTarget, setStatusTarget] = useState<CustomerUser | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const visibleUsers = useMemo(() => {
    if (!data) {
      return [];
    }

    const query = search.trim().toLowerCase();

    return data.users.filter((user) => {
      const matchesSearch =
        !query ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [data, roleFilter, search, statusFilter]);

  const activeCount = data?.users.filter((user) => user.status === 'ACTIVE').length ?? 0;
  const invitedCount = data?.users.filter((user) => user.status === 'INVITED').length ?? 0;
  const disabledCount = data?.users.filter((user) => user.status === 'DISABLED').length ?? 0;
  const hasFilters = search.trim().length > 0 || roleFilter !== 'ALL' || statusFilter !== 'ALL';

  function resetFilters() {
    setSearch('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
  }

  async function handleInvite(input: InviteCustomerUserInput) {
    setActionError(null);
    const created = await invite(input);
    setInviteOpen(false);
    setFeedback(`Invito creato per ${created.email}.`);
  }

  async function handleUpdate(userId: string, input: UpdateCustomerUserInput) {
    setActionError(null);
    const updated = await update(userId, input);
    setEditingUser(null);
    setFeedback(`${updated.firstName} ${updated.lastName} è stato aggiornato.`);
  }

  async function handleStatusChange() {
    if (!statusTarget) {
      return;
    }

    setActionError(null);

    try {
      const nextStatus = statusTarget.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
      const updated = await setStatus(statusTarget.id, { status: nextStatus });
      setFeedback(
        nextStatus === 'ACTIVE'
          ? `${updated.firstName} ${updated.lastName} è ora attivo.`
          : `${updated.firstName} ${updated.lastName} è stato disattivato.`,
      );
      setStatusTarget(null);
    } catch (statusError) {
      setActionError(
        statusError instanceof Error ? statusError.message : 'Modifica dello stato non riuscita.',
      );
      setStatusTarget(null);
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Azienda"
        title="Utenti"
        description="Gestisci chi può accedere agli impianti e assegna a ogni persona solo i permessi necessari."
        actions={
          data ? (
            <div className="users-page-actions">
              <button
                className="button button--secondary button--compact"
                disabled={isRefreshing}
                onClick={() => void refresh()}
                type="button"
              >
                <RefreshCw className={isRefreshing ? 'spin' : undefined} size={17} />
                Aggiorna
              </button>
              <button className="button button--primary" onClick={() => setInviteOpen(true)} type="button">
                <UserPlus size={17} />
                Invita utente
              </button>
            </div>
          ) : null
        }
      />

      {appConfig.demoMode ? (
        <div className="demo-banner">
          <Waves size={18} />
          <div>
            <strong>Demo mode attivo</strong>
            <span>
              Gli inviti non inviano email reali. Un utente invitato può essere attivato manualmente e poi accedere con la password demo.
            </span>
          </div>
        </div>
      ) : null}

      {feedback ? (
        <div className="users-feedback users-feedback--success" role="status">
          <UserCheck size={18} />
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} type="button">Chiudi</button>
        </div>
      ) : null}

      {actionError ? (
        <ErrorState title="Operazione non riuscita" message={actionError} />
      ) : null}

      {isLoading ? <UsersSkeleton /> : null}

      {!isLoading && error && !data ? (
        <ErrorState message={error} onRetry={() => void refresh()} />
      ) : null}

      {!isLoading && data && currentUser ? (
        <>
          {error ? (
            <ErrorState
              title="Aggiornamento non riuscito"
              message="Stai visualizzando l’ultima lista utenti caricata correttamente."
              onRetry={() => void refresh()}
            />
          ) : null}

          <section className="users-summary-grid" aria-label="Riepilogo utenti">
            <article className="user-summary-card user-summary-card--success">
              <div className="user-summary-card__icon"><UserCheck size={19} /></div>
              <span>Attivi</span>
              <strong>{activeCount}</strong>
              <small>Possono accedere al portale</small>
            </article>
            <article className="user-summary-card user-summary-card--warning">
              <div className="user-summary-card__icon"><UserRoundCog size={19} /></div>
              <span>Invitati</span>
              <strong>{invitedCount}</strong>
              <small>In attesa di attivazione</small>
            </article>
            <article className="user-summary-card user-summary-card--danger">
              <div className="user-summary-card__icon"><UserX size={19} /></div>
              <span>Disattivati</span>
              <strong>{disabledCount}</strong>
              <small>Accesso bloccato</small>
            </article>
          </section>

          <section className="users-panel">
            <div className="users-panel__heading">
              <div>
                <span className="section-heading__eyebrow">{currentUser.organizationName}</span>
                <h2>Utenti aziendali</h2>
                <p>
                  Aggiornato alle {formatTime(data.generatedAt)} · {visibleUsers.length}{' '}
                  {visibleUsers.length === 1 ? 'utente visualizzato' : 'utenti visualizzati'}
                </p>
              </div>
              <div className="users-owner-rule">
                <ShieldCheck size={17} />
                <span>Owner protetto</span>
              </div>
            </div>

            <div className="users-toolbar">
              <label className="users-search">
                <Search size={18} aria-hidden="true" />
                <input
                  aria-label="Cerca utente"
                  placeholder="Cerca nome o email..."
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <label className="users-filter-field">
                <span>Ruolo</span>
                <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}>
                  <option value="ALL">Tutti i ruoli</option>
                  <option value="CUSTOMER_OWNER">Owner</option>
                  <option value="CUSTOMER_ADMIN">Admin</option>
                  <option value="CUSTOMER_OPERATOR">Operator</option>
                  <option value="CUSTOMER_VIEWER">Viewer</option>
                </select>
              </label>

              <label className="users-filter-field">
                <span>Stato</span>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
                  <option value="ALL">Tutti gli stati</option>
                  <option value="ACTIVE">Attivi</option>
                  <option value="INVITED">Invitati</option>
                  <option value="DISABLED">Disattivati</option>
                </select>
              </label>

              <button className="button button--secondary button--compact" disabled={!hasFilters} onClick={resetFilters} type="button">
                <RotateCcw size={16} />
                Azzera
              </button>
            </div>

            <div className="users-table" aria-label="Utenti aziendali">
              <div className="users-table__header">
                <span>Utente</span>
                <span>Ruolo</span>
                <span>Stato</span>
                <span>Ultimo accesso</span>
                <span>Azioni</span>
              </div>

              {visibleUsers.length > 0 ? (
                visibleUsers.map((customerUser) => (
                  <UserRow
                    currentUserId={currentUser.id}
                    isBusy={mutatingUserId === customerUser.id}
                    key={customerUser.id}
                    onEdit={setEditingUser}
                    onToggleStatus={setStatusTarget}
                    user={customerUser}
                  />
                ))
              ) : (
                <div className="users-empty">
                  <UserRoundCog size={24} />
                  <strong>Nessun utente trovato</strong>
                  <span>Modifica i filtri oppure invita una nuova persona.</span>
                  {hasFilters ? (
                    <button className="button button--secondary button--compact" onClick={resetFilters} type="button">
                      Azzera filtri
                    </button>
                  ) : null}
                </div>
              )}
            </div>

            <div className="users-permissions-note">
              <strong>Ruoli disponibili</strong>
              <span>
                {customerRoleLabels.CUSTOMER_ADMIN}: utenti + controllo impianti · {customerRoleLabels.CUSTOMER_OPERATOR}: controllo impianti · {customerRoleLabels.CUSTOMER_VIEWER}: sola lettura.
              </span>
            </div>
          </section>
        </>
      ) : null}

      <InviteUserDialog
        isBusy={isInviting}
        isOpen={inviteOpen}
        onClose={() => {
          if (!isInviting) setInviteOpen(false);
        }}
        onSubmit={handleInvite}
      />

      <EditUserDialog
        isBusy={editingUser ? mutatingUserId === editingUser.id : false}
        onClose={() => {
          if (!mutatingUserId) setEditingUser(null);
        }}
        onSubmit={handleUpdate}
        user={editingUser}
      />

      <ConfirmDialog
        confirmLabel={statusTarget?.status === 'ACTIVE' ? 'Disattiva' : 'Attiva'}
        confirmTone={statusTarget?.status === 'ACTIVE' ? 'danger' : 'primary'}
        description={
          statusTarget?.status === 'ACTIVE'
            ? `Disattivare l’accesso di ${statusTarget.firstName} ${statusTarget.lastName}? Non potrà più accedere al Customer Portal.`
            : `Attivare l’accesso di ${statusTarget?.firstName ?? ''} ${statusTarget?.lastName ?? ''}?`
        }
        isBusy={statusTarget ? mutatingUserId === statusTarget.id : false}
        isOpen={statusTarget !== null}
        onCancel={() => {
          if (!mutatingUserId) setStatusTarget(null);
        }}
        onConfirm={() => void handleStatusChange()}
        title={statusTarget?.status === 'ACTIVE' ? 'Disattiva utente' : 'Attiva utente'}
      />
    </div>
  );
}
