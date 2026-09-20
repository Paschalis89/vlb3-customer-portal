import { Navigate, Outlet } from 'react-router-dom';
import type { CustomerPermission } from './permissions';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionRouteProps {
  permission: CustomerPermission;
}

export function PermissionRoute({ permission }: PermissionRouteProps) {
  const { can } = usePermissions();

  if (!can(permission)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
