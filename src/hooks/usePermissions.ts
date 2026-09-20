import { hasPermission, type CustomerPermission } from '../auth/permissions';
import { useAuth } from './useAuth';

export function usePermissions() {
  const { user } = useAuth();

  return {
    can(permission: CustomerPermission): boolean {
      return user ? hasPermission(user.role, permission) : false;
    },
  };
}
