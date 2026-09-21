import { customerUserStatusLabels } from '../../lib/users';
import type { CustomerUserStatus } from '../../types/user';

interface UserStatusBadgeProps {
  status: CustomerUserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const tone =
    status === 'ACTIVE' ? 'success' : status === 'INVITED' ? 'warning' : 'danger';

  return (
    <span className={`status-badge status-badge--${tone}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {customerUserStatusLabels[status]}
    </span>
  );
}
