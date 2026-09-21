import type { CustomerRole } from '../types/auth';
import type {
  AssignableCustomerRole,
  CustomerUser,
  CustomerUserStatus,
} from '../types/user';

export const assignableCustomerRoles: AssignableCustomerRole[] = [
  'CUSTOMER_ADMIN',
  'CUSTOMER_OPERATOR',
  'CUSTOMER_VIEWER',
];

export const customerUserStatusLabels: Record<CustomerUserStatus, string> = {
  ACTIVE: 'Attivo',
  INVITED: 'Invitato',
  DISABLED: 'Disattivato',
};

export const customerRoleDescriptions: Record<CustomerRole, string> = {
  CUSTOMER_OWNER: 'Controllo completo dell’organizzazione e gestione utenti.',
  CUSTOMER_ADMIN: 'Gestione utenti e controllo completo degli impianti.',
  CUSTOMER_OPERATOR: 'Monitoraggio e controllo delle pompe, senza gestione utenti.',
  CUSTOMER_VIEWER: 'Accesso in sola lettura a impianti, allarmi e storico.',
};

export function isAssignableCustomerRole(role: CustomerRole): role is AssignableCustomerRole {
  return role !== 'CUSTOMER_OWNER';
}

export function getCustomerUserFullName(user: Pick<CustomerUser, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function normalizeCustomerUserEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
