import { customerRoleLabels } from '../../auth/permissions';
import type { CustomerRole } from '../../types/auth';

interface UserRoleBadgeProps {
  role: CustomerRole;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  return (
    <span className={`user-role-badge user-role-badge--${role.toLowerCase()}`}>
      {customerRoleLabels[role]}
    </span>
  );
}
