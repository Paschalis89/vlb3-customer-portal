import type { ReactNode } from 'react';
import type { CustomerPermission } from './permissions';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGuardProps {
  permission: CustomerPermission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { can } = usePermissions();

  return can(permission) ? children : fallback;
}
