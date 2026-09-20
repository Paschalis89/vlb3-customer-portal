import type { CustomerRole } from '../types/auth';

export type CustomerPermission =
  | 'dashboard.read'
  | 'sites.read'
  | 'devices.read'
  | 'telemetry.read'
  | 'alerts.read'
  | 'history.read'
  | 'commands.start'
  | 'commands.stop'
  | 'commands.setFrequency'
  | 'users.read'
  | 'users.manage';

const readPermissions: CustomerPermission[] = [
  'dashboard.read',
  'sites.read',
  'devices.read',
  'telemetry.read',
  'alerts.read',
  'history.read',
];

export const permissionsByRole: Record<CustomerRole, CustomerPermission[]> = {
  CUSTOMER_OWNER: [
    ...readPermissions,
    'commands.start',
    'commands.stop',
    'commands.setFrequency',
    'users.read',
    'users.manage',
  ],
  CUSTOMER_ADMIN: [
    ...readPermissions,
    'commands.start',
    'commands.stop',
    'commands.setFrequency',
    'users.read',
    'users.manage',
  ],
  CUSTOMER_OPERATOR: [
    ...readPermissions,
    'commands.start',
    'commands.stop',
    'commands.setFrequency',
  ],
  CUSTOMER_VIEWER: [...readPermissions],
};

export function hasPermission(
  role: CustomerRole,
  permission: CustomerPermission,
): boolean {
  return permissionsByRole[role].includes(permission);
}

export const customerRoleLabels: Record<CustomerRole, string> = {
  CUSTOMER_OWNER: 'Owner',
  CUSTOMER_ADMIN: 'Admin',
  CUSTOMER_OPERATOR: 'Operator',
  CUSTOMER_VIEWER: 'Viewer',
};
