import { LockKeyhole, Pencil, Power, PowerOff, ShieldCheck, UserRound } from 'lucide-react';
import { formatDateTime, formatRelativeTime } from '../../lib/date';
import { getCustomerUserFullName } from '../../lib/users';
import type { CustomerUser } from '../../types/user';
import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';

interface UserRowProps {
  user: CustomerUser;
  currentUserId: string;
  isBusy: boolean;
  onEdit: (user: CustomerUser) => void;
  onToggleStatus: (user: CustomerUser) => void;
}

export function UserRow({ user, currentUserId, isBusy, onEdit, onToggleStatus }: UserRowProps) {
  const isOwner = user.role === 'CUSTOMER_OWNER';
  const isCurrentUser = user.id === currentUserId;
  const canManage = !isOwner && !isCurrentUser;

  return (
    <article className="user-row">
      <div className="user-row__identity">
        <div className="user-row__avatar" aria-hidden="true">
          <UserRound size={19} />
        </div>
        <div>
          <div className="user-row__name-line">
            <strong>{getCustomerUserFullName(user)}</strong>
            {isCurrentUser ? <span className="user-row__self">Tu</span> : null}
          </div>
          <span>{user.email}</span>
        </div>
      </div>

      <div className="user-row__role" data-label="Ruolo">
        <UserRoleBadge role={user.role} />
      </div>

      <div className="user-row__status" data-label="Stato">
        <UserStatusBadge status={user.status} />
      </div>

      <div className="user-row__last-login" data-label="Ultimo accesso">
        {user.lastLoginAt ? (
          <>
            <strong>{formatRelativeTime(user.lastLoginAt)}</strong>
            <span>{formatDateTime(user.lastLoginAt)}</span>
          </>
        ) : user.status === 'INVITED' ? (
          <>
            <strong>In attesa</strong>
            <span>Invito non ancora accettato</span>
          </>
        ) : (
          <>
            <strong>Mai</strong>
            <span>Nessun accesso registrato</span>
          </>
        )}
      </div>

      <div className="user-row__actions">
        {isOwner ? (
          <span className="user-row__protected">
            <ShieldCheck size={16} />
            Owner protetto
          </span>
        ) : isCurrentUser ? (
          <span className="user-row__protected">
            <LockKeyhole size={16} />
            Il tuo account
          </span>
        ) : (
          <>
            <button
              className="user-action-button"
              disabled={isBusy}
              onClick={() => onEdit(user)}
              type="button"
            >
              <Pencil size={15} />
              Modifica
            </button>
            <button
              className={`user-action-button ${user.status === 'ACTIVE' ? 'user-action-button--danger' : 'user-action-button--success'}`}
              disabled={isBusy}
              onClick={() => onToggleStatus(user)}
              type="button"
            >
              {user.status === 'ACTIVE' ? <PowerOff size={15} /> : <Power size={15} />}
              {user.status === 'ACTIVE' ? 'Disattiva' : 'Attiva'}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
